"""referencia_05_calculadora_cidr.py — auditora de sub-redes IPv4, CIDR e VLSM.

Executa: python saida/codigo/referencia_05_calculadora_cidr.py
Sem dependencias externas: usa apenas o modulo padrao ipaddress.
"""
import ipaddress


def auditar_subrede(cidr):
    print("\n=== ANALISE DE SUB-REDE:", cidr, "===")
    try:
        rede = ipaddress.ip_network(cidr, strict=False)
    except ValueError as exc:
        print("Erro: bloco CIDR invalido:", exc)
        return None
    print("Endereco de rede :", rede.network_address)
    print("Mascara          :", rede.netmask)
    print("Mascara reversa  :", rede.hostmask)
    print("Broadcast        :", rede.broadcast_address)
    print("Total de IPs     :", rede.num_addresses)
    if rede.prefixlen <= 30:
        print("Hosts uteis      :", rede.num_addresses - 2)
        print("Primeiro host    :", rede.network_address + 1)
        print("Ultimo host      :", rede.broadcast_address - 1)
    else:
        print("Bloco ponto-a-ponto/host (/31 ou /32).")
    return rede


def calcular_vlsm(bloco_pai, necessidades):
    print("\n=== DIVISAO VLSM DO BLOCO", bloco_pai, "===")
    pai = ipaddress.ip_network(bloco_pai, strict=False)
    atual = int(pai.network_address)
    fim = int(pai.broadcast_address)
    for req in sorted(necessidades, reverse=True):
        # prefixo minimo such that 2^(32-prefixo) - 2 >= req
        prefixo = 32
        while (1 << (32 - prefixo)) - 2 < req and prefixo > 0:
            prefixo -= 1
        sub = ipaddress.ip_network(f"{ipaddress.IPv4Address(atual)}/{prefixo}", strict=False)
        if int(sub.broadcast_address) > fim:
            print("ERRO: espaco insuficiente para", req, "hosts.")
            break
        print(f"Requerido {req:4d} hosts | alocado {sub.with_prefixlen:<18} | "
              f"faixa {sub.network_address + 1} - {sub.broadcast_address - 1}")
        atual = int(sub.broadcast_address) + 1
    return atual


def main():
    auditar_subrede("192.168.10.0/26")
    auditar_subrede("10.20.30.0/30")
    calcular_vlsm("10.0.0.0/24", [100, 50, 20, 10])
    print("\n[OK] Calculos de CIDR/VLSM concluidos.")


if __name__ == "__main__":
    main()

"""Fase 1 — extracao e reconstrucao estruturada do texto dos livros.

Entrada: livros/_ocr/*.txt (OCR derivado do Archive.org)
Saida:   saida/01_texto_extraido/<livro>/capNN.md + indice.md
"""
import os
import re
import sys
from collections import Counter
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OCR = os.path.join(BASE, "livros", "_ocr")
DEST = os.path.join(BASE, "saida", "01_texto_extraido")

# Reparos de acentuacao perdida na geracao do OCR (-caracteres viraram '?').
REPAROS = [
    (r"CAP.{0,3}TULO", "CAPÍTULO"), (r"Cap.{0,3}tulo", "Capítulo"),
    (r"cap.{0,3}tulo", "capítulo"), (r"EXERC.{0,3}CIOS", "EXERCÍCIOS"),
    (r"N.{0,3}MEROS", "NÚMEROS"), (r"FUN.{0,3}ÕES", "FUNÇÕES"),
    (r"OPERA.{0,3}ÕES", "OPERAÇÕES"), (r"RELA.{0,3}ÕES", "RELAÇÕES"),
    (r"CONDI.{0,3}ÕES", "CONDIÇÕES"), (r"EQUA.{0,3}ÕES", "EQUAÇÕES"),
    (r"ADI.{0,3}ÃO", "ADIÇÃO"), (r"SUBTRA.{0,3}ÃO", "SUBTRAÇÃO"),
    (r"MULTIPLICA.{0,3}ÃO", "MULTIPLICAÇÃO"), (r"DIVIS.{0,3}ÃO", "DIVISÃO"),
    (r"POTENCIA.{0,3}ÃO", "POTENCIAÇÃO"), (r"RADICIA.{0,3}ÃO", "RADICIAÇÃO"),
    (r"DEMONSTRA.{0,3}ÃO", "DEMONSTRAÇÃO"), (r"RESOLU.{0,3}ÃO", "RESOLUÇÃO"),
    (r"TRANSFORMA.{0,3}ÃO", "TRANSFORMAÇÃO"), (r"APLICA.{0,3}ÃO", "APLICAÇÃO"),
    (r"INTRODU.{0,3}ÃO", "INTRODUÇÃO"), (r"DEFINI.{0,3}ÃO", "DEFINIÇÃO"),
    (r"MATEM.{0,3}TICA", "MATEMÁTICA"), (r"ANAL.{0,3}TI", "ANALÍTI"),
    (r"COMBINAT.{0,3}RIA", "COMBINATÓRIA"), (r"GEOMETRIA ESPACIAL", "Geometria Espacial"),
    (r"NDICE", "ÍNDICE"), (r"TEORIA", "TEORIA"), (r"PR.{0,3}PRIO", "PRÓPRIO"),
    (r"M.{0,3}DULO", "MÓDULO"), (r"M.{0,3}XIMO", "MÁXIMO"), (r"M.{0,3}NIMO", "MÍNIMO"),
]


def limpar(texto):
    """Remove ruido de digitalizacao e repara acentos quebrados."""
    original_len = len(texto)
    texto = re.sub(r"(?im)^.*Scanned by CamScanner.*$", "", texto)
    texto = texto.replace("\x0c", "\n")
    for padrao, substituto in REPAROS:
        texto = re.sub(padrao, substituto, texto)
    # Remove linhas de pontilhado do indice e ruido de paginacao
    texto = re.sub(r"\.{6,}", " ... ", texto)
    texto = re.sub(r"(?m)^\s*[|]\s*$", "", texto)
    texto = re.sub(r"\n{3,}", "\n\n", texto)
    # Reconstrucao simples de expoentes em expressoes matematicas
    texto = re.sub(r"(?<=[A-Za-z0-9(+\-= ])([a-zA-Z])2(?=[ +\-)=.,\n])", r"\1²", texto)
    texto = re.sub(r"(?<=[A-Za-z0-9(+\-= ])([a-zA-Z])3(?=[ +\-)=.,\n])", r"\1³", texto)
    return texto, original_len - len(texto)


def titulo_livro(nome_arquivo):
    nome = re.sub(r"\.txt$", "", nome_arquivo, flags=re.I)
    nome = nome.strip()
    if "algebrista" in nome.lower():
        return "O_Algebrista", "O Algebrista — Laércio Vasconcelos"
    m = re.search(r"FME\s*(\d+)", nome, re.I)
    if m:
        return f"FME_{m.group(1)}", f"FME {m.group(1)} — Fundamentos da Matemática Elementar"
    if "tqm" in nome.lower():
        if "fundamental" in nome.lower():
            return "TQM_Fundamental", "TQM Ensino Fundamental (verde) — Roberto Ávila"
        return "TQM_Medio", "TQM Ensino Médio (azul) — Roberto Ávila"
    if "morgado" in nome.lower() or "combinat" in nome.lower():
        return "Morgado_Combinatoria", "Análise Combinatória e Probabilidade — Morgado et al."
    return re.sub(r"[^A-Za-z0-9]+", "_", nome).strip("_"), nome


def detectar_capitulos(texto):
    """Retorna (titulos, posicoes) a partir do indice e dos cabecalhos correntes."""
    titulos = {}
    for m in re.finditer(r"(?im)^CAPÍTULO\s*(\d{1,2})\s*[:;.]?\s*([^\n.]{3,80})", texto):
        n = int(m.group(1))
        titulo = re.sub(r"\s+", " ", m.group(2)).strip(" .:")
        if n not in titulos and len(titulo) > 3:
            titulos[n] = titulo
    posicoes = {}
    limite_indice = int(len(texto) * 0.02)
    for n in sorted(titulos):
        # Cabecalho correntes usam "Capítulo N - Titulo" (case sensitive, sem pontilhado do indice).
        padrao = re.compile(rf"(?m)^Capítulo\s*{n}\s*[-–—]\s*[^\n.]{{3,70}}$")
        encontradas = [m.start() for m in padrao.finditer(texto) if m.start() > limite_indice]
        if encontradas:
            posicoes[n] = encontradas[0]
    # Filtra numeros espurios gerados por ruido do OCR no indice (ex.: 47, 69).
    titulos = {n: t for n, t in titulos.items() if 1 <= n <= 30}
    if not titulos:
        # Fallback: titulos curtos em caixa alta (capitulos sem cabecalho reconhecivel)
        cand = re.findall(r"(?m)^([A-ZÀ-Ú][A-ZÀ-Ú\s]{6,60})$", texto[:60000])
        for i, c in enumerate(cand[:20], 1):
            titulos[i] = re.sub(r"\s+", " ", c).strip()
    return titulos, posicoes


def secoes_do_trecho(trecho):
    secoes = []
    for linha in trecho.split("\n"):
        s = linha.strip()
        if not s or len(s) > 90 or len(s) < 6:
            continue
        if re.match(r"^(CAPÍTULO|Capítulo|\d+\.\s|[A-ZÀ-Ú][a-zà-ú]+(\s[A-ZÀ-Ú][a-zà-ú]+){1,5}$)", s):
            secoes.append(s)
        if len(secoes) >= 12:
            break
    return secoes


def termos_frequentes(trecho):
    palavras = re.findall(r"[A-Za-zÀ-ÿ]{5,}", trecho.lower())
    ignorar = {"capítulo", "exercícios", "página", "scanned", "camscanner", "solução", "propriedade"}
    cont = Counter(p for p in palavras if p not in ignorar)
    return [p for p, _ in cont.most_common(12)]


def processar(caminho_ocr):
    nome_arq = os.path.basename(caminho_ocr)
    slug, titulo = titulo_livro(nome_arq)
    bruto = open(caminho_ocr, encoding="utf-8", errors="replace").read()
    texto, removidos = limpar(bruto)
    titulos, posicoes = detectar_capitulos(texto)
    pasta = os.path.join(DEST, slug)
    os.makedirs(pasta, exist_ok=True)

    numeros = sorted(titulos) if titulos else [1]
    # Se nao ha posicoes confiaveis, divide o corpo equally (fallback documentado).
    usar_posicoes = len(posicoes) >= max(2, len(numeros) // 2)
    limites = []
    if usar_posicoes:
        inicio = min(posicoes.values())
        for i, n in enumerate(numeros):
            ini = posicoes.get(n, inicio)
            fim = posicoes.get(numeros[i + 1], len(texto)) if i + 1 < len(numeros) else len(texto)
            limites.append((ini, fim))
    else:
        # Sem cabecalhos confiaveis: descarta o indice e divide o corpo proporcionalmente.
        inicio_corpo = min(posicoes.values()) if posicoes else int(len(texto) * 0.03)
        tamanho = (len(texto) - inicio_corpo) // len(numeros)
        for i, n in enumerate(numeros):
            limites.append((inicio_corpo + i * tamanho, inicio_corpo + (i + 1) * tamanho))

    linhas_indice = [
        f"# Sumário estruturado — {titulo}", "",
        f"- Fonte: `livros/_ocr/{nome_arq}`",
        f"- Processado em: {datetime.now(timezone.utc).astimezone().isoformat(timespec='seconds')}",
        f"- Caracteres brutos: {len(bruto):,} | após limpeza: {len(texto):,} | removidos: {removidos:,}",
        f"- Capítulos detectados: {len(numeros)}",
        f"- Modo de segmentação: {'cabeçalhos detectados' if usar_posicoes else 'divisão proporcional (OCR sem cabeçalhos confiáveis)'}",
        "", "## Capítulos", "", "| Arquivo | Capítulo | Título | Caracteres |", "| --- | ---: | --- | ---: |",
    ]

    for (ini, fim), n in zip(limites, numeros):
        trecho = texto[ini:fim].strip()
        if len(trecho) < 200:
            trecho = texto[max(0, ini - 500): min(len(texto), fim + 1000)].strip()
        secoes = secoes_do_trecho(trecho)
        termos = termos_frequentes(trecho)
        conteudo = [
            f"# Capítulo {n:02d} — {titulos.get(n, 'Título não identificado')}", "",
            "## Metadados", "",
            f"- Livro: {titulo}",
            f"- Capítulo: {n:02d}",
            f"- Trecho OCR: caracteres {ini:,}–{fim:,}",
            "- Origem: texto OCR derivado do Archive.org (pós-processamento local)",
            "", "## Sumário da estrutura", "",
        ]
        conteudo += [f"- {s}" for s in secoes] if secoes else ["- Estrutura de seções não identificada de forma confiável no OCR."]
        conteudo += ["", "## Texto reconstruído", "", "```text", trecho[:26000], "```", "",
                     "## Termos recorrentes", "", " · ".join(termos), "",
                     "## Notas de reconstrução", "",
                     f"- Removidas {removidos:,} marcas de digitalização e pontilhações de índice.",
                     "- Acentuação reparada onde o OCR substituiu caracteres por '?'.",
                     "- Expoentes reconstruídos em padrões algébricos simples (ex.: x2 → x²).",
                     "- Fórmulas complexas são refeitas e validadas na Fase 2 e na Fase 4.",
                     ""]
        caminho = os.path.join(pasta, f"cap{n:02d}.md")
        with open(caminho, "w", encoding="utf-8") as f:
            f.write("\n".join(conteudo))
        linhas_indice.append(f"| `cap{n:02d}.md` | {n} | {titulos.get(n, '?')} | {len(trecho):,} |")

    with open(os.path.join(pasta, "indice.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(linhas_indice) + "\n")
    return slug, len(numeros)


def main():
    os.makedirs(DEST, exist_ok=True)
    arquivos = sorted(os.listdir(OCR))
    total = 0
    for nome in arquivos:
        if not nome.lower().endswith(".txt"):
            continue
        slug, n = processar(os.path.join(OCR, nome))
        print(f"[OK] {slug}: {n} capítulos")
        total += n
    print(f"[FIM] {len(arquivos)} fontes OCR, {total} capítulos gerados.")


if __name__ == "__main__":
    sys.exit(main())

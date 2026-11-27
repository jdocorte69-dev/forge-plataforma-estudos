"""Verifica por HTTP os URLs de js/data-library-extra.js (FORGE 7.0).

Uso: python saida/codigo/verificar_links_biblioteca.py

Não instala dependências e não altera o catálogo: apenas grava
saida/09_biblioteca_verificada/links_verificados.{md,json} com status real.
Um status só é registrado como 200 quando o servidor responde 200 após
redirecionamentos; falhas são registradas com código/erro exatos.
"""
from __future__ import annotations

import concurrent.futures
import datetime as dt
import json
import re
import urllib.error
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CATALOGO = RAIZ / "js" / "data-library-extra.js"
SAIDA = RAIZ / "saida" / "09_biblioteca_verificada"
TIMEOUT = 20
CATEGORIAS_META = ["Matemática", "Cálculo", "Algoritmos/C/Linguagens",
                   "Arquitetura/SO", "Redes/Cripto", "IA/ML"]
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; FORGE-LinkAudit/1.0; educational)",
    "Accept": "text/html,application/pdf,*/*",
}
BLOCO = re.compile(
    r'\{\s*title:\s*"(?P<title>[^"]*)".*?area:\s*"(?P<area>[^"]*)".*?'
    r'free:\s*(?P<free>true|false).*?url:\s*"(?P<url>[^"]*)".*?\}',
    re.DOTALL,
)


def ler_entradas():
    texto = CATALOGO.read_text(encoding="utf-8")
    entradas = [
        {
            "titulo": m.group("title"),
            "area": m.group("area"),
            "free": m.group("free") == "true",
            "url": m.group("url"),
        }
        for m in BLOCO.finditer(texto)
    ]
    return entradas, texto.count("title:")


def verificar(url):
    """Retorna (status, url_final, erro). Status None significa falha de rede."""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resposta:
            resposta.read(512)  # força a resposta sem baixar o corpo inteiro
            return resposta.status, resposta.geturl(), ""
    except urllib.error.HTTPError as exc:
        return exc.code, url, f"HTTPError {exc.reason}"
    except Exception as exc:  # URLError, timeout, SSL, etc.
        return None, url, f"{type(exc).__name__}: {exc}"


def main() -> int:
    entradas, contagem_titulos = ler_entradas()
    if len(entradas) != contagem_titulos:
        print(f"AVISO: {len(entradas)} blocos lidos, mas {contagem_titulos} campos title no JS.")
    hoje = dt.date.today().isoformat()
    urls = sorted({e["url"] for e in entradas if e["url"]})
    print(f"Verificando {len(urls)} URLs unicos de {len(entradas)} entradas (timeout {TIMEOUT}s)...")

    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        estados = dict(zip(urls, pool.map(verificar, urls)))

    resultados = []
    for entrada in entradas:
        status, final, erro = estados.get(entrada["url"], (None, "", "URL ausente"))
        resultados.append({
            "titulo": entrada["titulo"],
            "area": entrada["area"],
            "free": entrada["free"],
            "url": entrada["url"],
            "status": status,
            "http200": status == 200,
            "finalUrl": final,
            "erro": erro,
            "verificadoEm": hoje if status == 200 else "",
        })

    areas = sorted({r["area"] for r in resultados})
    por_area = {
        area: {
            "entradas": sum(1 for r in resultados if r["area"] == area),
            "http200": sum(1 for r in resultados if r["area"] == area and r["http200"]),
            "http200Gratuitas": sum(1 for r in resultados
                                    if r["area"] == area and r["http200"] and r["free"]),
        }
        for area in areas
    }
    ok_urls = sum(1 for u in urls if estados[u][0] == 200)
    ok_entradas = sum(1 for r in resultados if r["http200"])
    ok_gratuitas = sum(1 for r in resultados if r["http200"] and r["free"])

    dados = {
        "verificadoEm": hoje,
        "metodo": "Python urllib.request GET (User-Agent FORGE-LinkAudit/1.0), timeout 20s, redirecionamentos seguidos",
        "totalEntradasCatalogo": len(entradas),
        "urlsUnicas": len(urls),
        "urlsHttp200": ok_urls,
        "entradasHttp200": ok_entradas,
        "entradasHttp200Gratuitas": ok_gratuitas,
        "porArea": por_area,
        "totalSeisCategoriasHttp200": sum(por_area[a]["http200"] for a in CATEGORIAS_META),
        "resultados": resultados,
    }

    SAIDA.mkdir(parents=True, exist_ok=True)
    (SAIDA / "links_verificados.json").write_text(
        json.dumps(dados, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    linhas = [
        "# Verificação de links do catálogo FORGE",
        "",
        f"- Data da checagem: **{hoje}**",
        f"- Método: {dados['metodo']}",
        f"- Entradas no catálogo: **{len(entradas)}**; URLs únicos: **{len(urls)}**",
        f"- URLs com HTTP 200: **{ok_urls}/{len(urls)}**",
        f"- Entradas com HTTP 200: **{ok_entradas}** (delas, **{ok_gratuitas}** marcadas como gratuitas)",
        "- `free: false` com URL 200 significa apenas que o link responde; não implica acesso aberto.",
        "- Status diferente de 200 (ou vazio) está registrado com o erro exato; não é contado como verificado.",
        "",
        "## Por área",
        "",
        "| Área | Entradas | HTTP 200 | HTTP 200 e gratuitas |",
        "| --- | ---: | ---: | ---: |",
    ]
    for area in areas:
        v = por_area[area]
        linhas.append(f"| {area} | {v['entradas']} | {v['http200']} | {v['http200Gratuitas']} |")
    total_meta = sum(por_area[a]["http200"] for a in CATEGORIAS_META)
    linhas += [
        "",
        "## Meta FORGE 7.0 (6 categorias)",
        "",
        "As seis categorias da curadoria verificada: " +
        ", ".join(f"{a} ({por_area[a]['http200']})" for a in CATEGORIAS_META) + ".",
        f"**Total: {total_meta} recursos com HTTP 200** (meta: pelo menos 30).",
        "",
        "Entradas sem URL são do catálogo legado e ficam fora da verificação HTTP;",
        "isso está registrado como `sem resposta`, nunca como 200.",
        "",
        "## Detalhe por recurso",
        "",
        "| Título | Área | Acesso no catálogo | Status | URL | Destino final / erro |",
        "| --- | --- | --- | ---: | --- | --- |",
    ]
    for r in resultados:
        detalhe = r["finalUrl"] if r["http200"] and r["finalUrl"] != r["url"] else (r["erro"] or "—")
        detalhe = detalhe.replace("|", "\\|")
        linhas.append(
            f"| {r['titulo'].replace('|', chr(92) + '|')} | {r['area']} | "
            f"{'gratuito' if r['free'] else 'não gratuito'} | "
            f"{r['status'] if r['status'] is not None else 'sem resposta'} | "
            f"{r['url']} | {detalhe} |")
    falhas = [r for r in resultados if not r["http200"]]
    linhas += ["", "## Não verificados (sem HTTP 200)", ""]
    if falhas:
        for r in falhas:
            linhas.append(f"- **{r['titulo']}** — `{r['url']}` — {r['status']}: {r['erro']}")
    else:
        linhas.append("- Nenhum.")
    linhas.append("")
    (SAIDA / "links_verificados.md").write_text("\n".join(linhas), encoding="utf-8")

    print(f"HTTP 200: {ok_urls}/{len(urls)} URLs | {ok_entradas} entradas | {ok_gratuitas} gratuitas")
    print(f"Saída: {SAIDA / 'links_verificados.md'} e {SAIDA / 'links_verificados.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

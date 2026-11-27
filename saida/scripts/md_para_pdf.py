"""Conversor Markdown -> PDF usando apenas reportlab e fontes locais.

Nenhum servicio externo é utilizado. Suporta: títulos, listas, citações,
blocos de código, tabelas, negrito/itálico e código inline.
"""
import os
import re
import sys
from datetime import datetime, timezone

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Preformatted,
    Spacer, Table, TableStyle, PageBreak, KeepTogether,
)

import matplotlib

FONTS = os.path.join(os.path.dirname(matplotlib.__file__), "mpl-data", "fonts", "ttf")
_registrado = False


def registrar_fontes():
    global _registrado
    if _registrado:
        return
    pdfmetrics.registerFont(TTFont("DejaVu", os.path.join(FONTS, "DejaVuSans.ttf")))
    pdfmetrics.registerFont(TTFont("DejaVu-Bold", os.path.join(FONTS, "DejaVuSans-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("DejaVu-Italic", os.path.join(FONTS, "DejaVuSans-Oblique.ttf")))
    pdfmetrics.registerFont(TTFont("DejaVuMono", os.path.join(FONTS, "DejaVuSansMono.ttf")))
    for nome in ("DejaVu", "DejaVu-Bold", "DejaVu-Italic", "DejaVuMono"):
        pdfmetrics.registerFontFamily(nome.replace("-Bold", "").replace("-Italic", "").replace("Mono", ""),
                                      normal=nome if "-" not in nome and "Mono" not in nome else "DejaVu",
                                      bold="DejaVu-Bold", italic="DejaVu-Italic", boldItalic="DejaVu-Bold")
    _registrado = True


def estilos():
    registrar_fontes()
    base = getSampleStyleSheet()
    def est(nome, **kw):
        padrao = dict(fontName="DejaVu", fontSize=9.5, leading=13.5, alignment=TA_JUSTIFY,
                      textColor=colors.HexColor("#1a1a1a"), spaceAfter=5)
        padrao.update(kw)
        return ParagraphStyle(nome, parent=base["Normal"], **padrao)
    return {
        "h1": est("h1", fontName="DejaVu-Bold", fontSize=18, leading=23, alignment=TA_LEFT,
                  textColor=colors.HexColor("#103A5C"), spaceBefore=12, spaceAfter=10),
        "h2": est("h2", fontName="DejaVu-Bold", fontSize=13.5, leading=18, alignment=TA_LEFT,
                  textColor=colors.HexColor("#145A7E"), spaceBefore=10, spaceAfter=6),
        "h3": est("h3", fontName="DejaVu-Bold", fontSize=11, leading=15, alignment=TA_LEFT,
                  textColor=colors.HexColor("#1D6B87"), spaceBefore=8, spaceAfter=4),
        "h4": est("h4", fontName="DejaVu-Bold", fontSize=9.8, leading=13.5, alignment=TA_LEFT,
                  textColor=colors.HexColor("#333333"), spaceBefore=6, spaceAfter=3),
        "normal": est("normal"),
        "bullet": est("bullet", leftIndent=14, bulletIndent=4, alignment=TA_LEFT, spaceAfter=3),
        "num": est("num", leftIndent=16, alignment=TA_LEFT, spaceAfter=3),
        "quote": est("quote", leftIndent=16, rightIndent=10, alignment=TA_LEFT,
                     textColor=colors.HexColor("#3C6E47"), fontSize=9, leading=12.5),
        "code": est("code", fontName="DejaVuMono", fontSize=7.8, leading=10.2,
                    alignment=TA_LEFT, backColor=colors.HexColor("#F2F4F7"),
                    borderColor=colors.HexColor("#D0D7DE"), borderWidth=0.5,
                    borderPadding=5, leftIndent=4, spaceAfter=6),
        "cell": est("cell", fontSize=7.8, leading=10.2, alignment=TA_LEFT, spaceAfter=0),
        "cellh": est("cellh", fontName="DejaVu-Bold", fontSize=7.8, leading=10.2,
                     alignment=TA_LEFT, textColor=colors.white, spaceAfter=0),
        "titulo": est("titulo", fontName="DejaVu-Bold", fontSize=26, leading=32,
                      alignment=TA_CENTER, textColor=colors.HexColor("#0B3550")),
        "subtitulo": est("subtitulo", fontSize=12, leading=17, alignment=TA_CENTER,
                         textColor=colors.HexColor("#4A5F6D")),
    }


def inline(texto):
    """Converte marcações inline para XML do reportlab, com escape seguro."""
    s = texto.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    s = re.sub(r"`([^`]+)`", r'<font name="DejaVuMono" size="8" color="#A03030">\1</font>', s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", s)
    return s


def quebrar_linha(texto, limite=108):
    """Quebra linhas longas de código para não vazar da margem."""
    out = []
    for linha in texto.split("\n"):
        while len(linha) > limite:
            corte = max(linha.rfind(" ", 0, limite), linha.rfind(",", 0, limite),
                        linha.rfind("(", 0, limite))
            if corte < limite // 2:
                corte = limite
            out.append(linha[:corte])
            linha = " " * 2 + linha[corte:].lstrip()
        out.append(linha)
    return "\n".join(out)


def parse_tabela(linhas, i, est):
    cabecalho = [c.strip() for c in linhas[i].strip().strip("|").split("|")]
    i += 1
    if i < len(linhas) and re.match(r"^\s*\|?[\s:\-|]+\|?\s*$", linhas[i]):
        i += 1
    corpo = []
    while i < len(linhas) and linhas[i].strip().startswith("|"):
        corpo.append([c.strip() for c in linhas[i].strip().strip("|").split("|")])
        i += 1
    ncol = max([len(cabecalho)] + [len(r) for r in corpo])
    cabecalho += [""] * (ncol - len(cabecalho))
    dados = [[Paragraph(inline(c), est["cellh"]) for c in cabecalho]]
    for linha in corpo:
        linha += [""] * (ncol - len(linha))
        dados.append([Paragraph(inline(c), est["cell"]) for c in linha])
    largura = A4[0] - 3.2 * cm
    # Pesos: cabeçalho curto recebe menos espaço, texto longo recebe mais.
    pesos = [max(1.0, min(4.0, len(c) / 12.0 + 1.0)) for c in cabecalho]
    for linha in corpo:
        for j, c in enumerate(linha):
            pesos[j] = max(pesos[j], min(5.0, len(c) / 45.0 + 0.8))
    soma = sum(pesos)
    colwidths = [largura * p / soma for p in pesos]
    t = Table(dados, colWidths=colwidths, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#145A7E")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F4F7F9")]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#B8C5CE")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return [t, Spacer(1, 7)], i


def md_para_story(caminho, est, incluir_titulo=True):
    linhas = open(caminho, encoding="utf-8").read().splitlines()
    story = []
    i = 0
    while i < len(linhas):
        linha = linhas[i].rstrip()
        s = linha.strip()
        if not s:
            i += 1
            continue
        if s.startswith("```"):
            i += 1
            bloco = []
            while i < len(linhas) and not linhas[i].strip().startswith("```"):
                bloco.append(linhas[i])
                i += 1
            i += 1
            if bloco:
                story.append(Preformatted(quebrar_linha("\n".join(bloco)), est["code"]))
            continue
        if s.startswith("|") and i + 1 < len(linhas) and linhas[i + 1].strip().startswith("|"):
            blocos, i = parse_tabela(linhas, i, est)
            story.extend(blocos)
            continue
        m = re.match(r"^(#{1,4})\s+(.*)$", s)
        if m:
            nivel = len(m.group(1))
            chave = {1: "h1", 2: "h2", 3: "h3", 4: "h4"}[min(nivel, 4)]
            story.append(Paragraph(inline(m.group(2)), est[chave]))
            i += 1
            continue
        if s.startswith("---") and set(s) <= {"-", " "}:
            story.append(Spacer(1, 4))
            i += 1
            continue
        if s.startswith("> "):
            story.append(Paragraph(inline(s[2:]), est["quote"]))
            i += 1
            continue
        if s.startswith(("- ", "* ", "· ")):
            story.append(Paragraph(inline(s[2:]), est["bullet"], bulletText="•"))
            i += 1
            continue
        m = re.match(r"^(\d+)[.)]\s+(.*)$", s)
        if m:
            story.append(Paragraph(inline(m.group(2)), est["num"], bulletText=m.group(1) + "."))
            i += 1
            continue
        # Parágrafo: junta linhas consecutivas que não iniciam outra estrutura.
        par = [s]
        i += 1
        while i < len(linhas):
            prox = linhas[i].strip()
            if (not prox or prox.startswith(("#", "|", "```", "- ", "* ", "> ", "---"))
                    or re.match(r"^\d+[.)]\s", prox)):
                break
            par.append(prox)
            i += 1
        story.append(Paragraph(inline(" ".join(par)), est["normal"]))
    return story


def cabecalho_pdf(canvas, doc, titulo_curto):
    canvas.saveState()
    canvas.setFont("DejaVu", 7.5)
    canvas.setFillColor(colors.HexColor("#5A6B78"))
    canvas.drawString(2 * cm, A4[1] - 1.1 * cm, titulo_curto[:85])
    canvas.drawRightString(A4[0] - 2 * cm, A4[1] - 1.1 * cm, "FORGE · ecossistema de estudos")
    canvas.setStrokeColor(colors.HexColor("#C6D2DA"))
    canvas.line(2 * cm, A4[1] - 1.25 * cm, A4[0] - 2 * cm, A4[1] - 1.25 * cm)
    canvas.line(2 * cm, 1.25 * cm, A4[0] - 2 * cm, 1.25 * cm)
    canvas.drawCentredString(A4[0] / 2, 0.8 * cm, f"Página {doc.page}")
    canvas.restoreState()


def converter(caminhos_md, caminho_pdf, titulo, subtitulo=""):
    """Converte uma lista de arquivos markdown em um único PDF com capa."""
    registrar_fontes()
    est = estilos()
    os.makedirs(os.path.dirname(caminho_pdf), exist_ok=True)
    doc = BaseDocTemplate(
        caminho_pdf, pagesize=A4,
        leftMargin=2 * cm, rightMargin=2 * cm, topMargin=1.7 * cm, bottomMargin=1.6 * cm,
        title=titulo, author="FORGE — ecossistema de estudos", subject=subtitulo,
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="principal", frames=[frame],
                                       onPage=lambda c, d: cabecalho_pdf(c, d, titulo))])
    story = [Spacer(1, 4.2 * cm),
             Paragraph(inline(titulo), est["titulo"]),
             Spacer(1, 0.5 * cm)]
    if subtitulo:
        story.append(Paragraph(inline(subtitulo), est["subtitulo"]))
    story.append(Spacer(1, 0.8 * cm))
    story.append(Paragraph(
        f"Gerado em {datetime.now(timezone.utc).astimezone().strftime('%d/%m/%Y %H:%M')} · "
        "Conteúdo autoral, reescrito a partir do corpus local · Fórmulas validadas com SymPy",
        est["subtitulo"]))
    story.append(PageBreak())
    for indice, caminho in enumerate(caminhos_md):
        if indice > 0:
            story.append(PageBreak())
        story.extend(md_para_story(caminho, est))
    doc.build(story)
    return caminho_pdf


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Uso: python md_para_pdf.py <saida.pdf> <titulo> <md1> [md2 ...]")
        sys.exit(1)
    pdf, titulo, *mds = sys.argv[1:]
    print(converter(mds, pdf, titulo))

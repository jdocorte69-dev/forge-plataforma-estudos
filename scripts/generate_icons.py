"""Gera os ícones PWA do FORGE 3.0 localmente, sem dependências pagas.

Uso: python scripts/generate_icons.py
Requer Pillow (já disponível no ambiente de desenvolvimento).
"""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
S = 4  # supersampling para bordas suaves
BG = "#101827"
GLYPH = "#e8eef9"
DOT = "#9b91ff"


def draw_icon(size: int, maskable: bool) -> Image.Image:
    canvas = Image.new("RGB", (size * S, size * S), BG)
    d = ImageDraw.Draw(canvas)
    k = size * S / 512

    def rect(x0, y0, x1, y1, color):
        d.rectangle((x0 * k, y0 * k, x1 * k, y1 * k), fill=color)

    # "any": fundo com cantos arredondados, como o icon.svg legado.
    # "maskable": fundo sangrando até as bordas e arte dentro da zona segura.
    if not maskable:
        d.rounded_rectangle((0, 0, size * S - 1, size * S - 1), radius=96 * k, fill=BG)

    # Letra F estilizada (mesma geometria do icon.svg).
    rect(128, 128, 192, 384, GLYPH)
    rect(192, 128, 384, 192, GLYPH)
    rect(192, 240, 320, 288, GLYPH)
    d.ellipse((360 * k, 104 * k, 408 * k, 152 * k), fill=DOT)

    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    for size in (192, 512):
        draw_icon(size, maskable=False).save(ROOT / f"icon-{size}.png", optimize=True)
        draw_icon(size, maskable=True).save(ROOT / f"icon-maskable-{size}.png", optimize=True)
        print(f"ícones {size}px gerados")


if __name__ == "__main__":
    main()

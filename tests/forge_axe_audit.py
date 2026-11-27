"""FORGE 7.0 — auditoria axe-core WCAG 2.2 AA (temas claro/escuro).

Uso:
    $env:FORGE_AXE_PATH='<caminho para axe.min.js>'
    python tests/forge_axe_audit.py

O caminho é local ao ambiente de validação; nenhum CDN é usado pela aplicação.
"""

import glob
import os
import sys

from playwright.sync_api import sync_playwright

BASE = os.environ.get("FORGE_BASE", "http://127.0.0.1:8766/index.html")
VIEWPORTS = [("desktop", 1440, 900), ("mobile", 390, 844)]
PAGES = [
    "dashboard", "tracks", "lab", "study", "settings", "library", "plan",
    "oral", "bugs", "crypto", "summaries", "porque", "protocol", "stellar", "tools",
]
TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]


def axe_path():
    configured = os.environ.get("FORGE_AXE_PATH")
    if configured and os.path.isfile(configured):
        return configured
    roots = [os.environ.get("LOCALAPPDATA", ""), os.environ.get("TEMP", ""), "D:\\REA\\npm-cache"]
    for root in roots:
        if not root:
            continue
        for found in glob.glob(os.path.join(root, "**", "axe.min.js"), recursive=True):
            return found
    raise SystemExit("axe.min.js não encontrado; defina FORGE_AXE_PATH.")


def main():
    axe = axe_path()
    failures = []
    total = 0
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for label, width, height in VIEWPORTS:
            for theme in ("dark", "light"):
                context = browser.new_context(viewport={"width": width, "height": height}, locale="pt-BR")
                page = context.new_page()
                errors = []
                page.on("pageerror", lambda exc: errors.append(str(exc)))
                page.goto(BASE, wait_until="domcontentloaded")
                page.evaluate("window.forgeReady")
                page.evaluate("""t => {
                  const current = document.documentElement.dataset.theme;
                  if (current !== t) document.getElementById('themeBtn').click();
                }""", theme)
                assert page.evaluate("document.documentElement.dataset.theme") == theme
                page.add_script_tag(path=axe)
                for route in PAGES:
                    total += 1
                    page.evaluate("r => goToPage(r)", route)
                    # .nav button tem transition: all .2s; auditamos depois que
                    # as cores transicionais assentam, não no meio do fade.
                    page.wait_for_timeout(320)
                    violations = page.evaluate("""async tags => {
                      const r = await axe.run(document, { runOnly: { type: 'tag', values: tags } });
                      return r.violations.map(v => ({
                        id: v.id, impact: v.impact, help: v.help,
                        nodes: v.nodes.length,
                        targets: v.nodes.slice(0, 3).map(n => n.target.join(' '))
                      }));
                    }""", TAGS)
                    scenario = f"{label}/{theme}/{route}"
                    if violations:
                        failures.append((scenario, violations))
                        print(f"FAIL | {scenario}: " + "; ".join(
                            f"{v['id']}({v['nodes']}) {v['targets'][0] if v['targets'] else ''}" for v in violations))
                    else:
                        print(f"PASS | {scenario}")
                # Leitor de resumo também é uma superfície de leitura.
                total += 1
                page.evaluate("goToPage('summaries'); SummariesPage.open('FME_1/cap01')")
                page.wait_for_selector("#summaryArticle h3", timeout=10000)
                # Mesma espera das rotas: a cor da aba ativa ainda transiciona.
                page.wait_for_timeout(320)
                violations = page.evaluate("""async tags => {
                  const r = await axe.run(document, { runOnly: { type: 'tag', values: tags } });
                  return r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length,
                    targets: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }));
                }""", TAGS)
                scenario = f"{label}/{theme}/summaries-reader"
                if violations:
                    failures.append((scenario, violations))
                    print(f"FAIL | {scenario}: " + "; ".join(
                        f"{v['id']}({v['nodes']}) {v['targets'][0] if v['targets'] else ''}" for v in violations))
                else:
                    print(f"PASS | {scenario}")
                if errors:
                    print(f"ERROS JS em {label}/{theme}: {errors[:3]}")
                    failures.append((f"{label}/{theme}/pageerror", errors[:3]))
                context.close()
        browser.close()
    print(f"\n{total - len([f for f in failures if not f[0].endswith('pageerror')])}/{total} cenários sem violações axe-core.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())

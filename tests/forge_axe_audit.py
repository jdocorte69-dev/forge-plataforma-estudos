"""FORGE 9.0 — auditoria axe-core WCAG 2.2 AA (temas claro/escuro).

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
    # FORGE 8.0 — rotas e superfícies novas.
    "deep-lesson", "review", "mistakes", "feynman", "domain", "books",
    "glossary", "catalog", "projects", "focus",
    # FORGE 9.0 — OMEGA / AssaadFlix.
    "mental", "trilha13", "trilha14", "flix",
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
                def audit(name, settle=320):
                    nonlocal total
                    total += 1
                    # .nav button tem transição de cor; auditamos depois que as
                    # cores assentam, não no meio do fade.
                    page.wait_for_timeout(settle)
                    violations = page.evaluate("""async tags => {
                      const r = await axe.run(document, { runOnly: { type: 'tag', values: tags } });
                      return r.violations.map(v => ({
                        id: v.id, impact: v.impact, help: v.help,
                        nodes: v.nodes.length,
                        targets: v.nodes.slice(0, 3).map(n => n.target.join(' '))
                      }));
                    }""", TAGS)
                    scenario = f"{label}/{theme}/{name}"
                    if violations:
                        failures.append((scenario, violations))
                        print(f"FAIL | {scenario}: " + "; ".join(
                            f"{v['id']}({v['nodes']}) {v['targets'][0] if v['targets'] else ''}" for v in violations))
                    else:
                        print(f"PASS | {scenario}")

                for route in PAGES:
                    page.evaluate("r => goToPage(r)", route)
                    audit(route)

                # Leitor de resumo também é uma superfície de leitura.
                page.evaluate("goToPage('summaries'); SummariesPage.open('FME_1/cap01')")
                page.wait_for_selector("#summaryArticle h3", timeout=10000)
                audit("summaries-reader")

                # FORGE 8.0 — estados transitórios e componentes aditivos.
                page.evaluate("goToPage('dashboard')")
                page.locator("#f8Onboard [data-f8-onboard='next']").click()
                assert page.locator("#f8Onboard [data-f8-onboard-step='1']").is_visible()
                audit("onboarding-step-2")
                page.locator("#f8Onboard [data-f8-onboard='next']").click()
                assert page.locator("#f8Onboard [data-f8-onboard-step='2']").is_visible()
                audit("onboarding-step-3")
                page.locator("#f8Onboard [data-f8-onboard='prev']").click()
                page.locator("#f8Onboard [data-f8-onboard='prev']").click()
                assert page.locator("#f8Onboard [data-f8-onboard-step='0']").is_visible()
                page.locator("#f8Onboard .f8-info").first.click()
                assert page.locator("#f8Onboard .f8-tip:not([hidden])").count() == 1
                audit("onboarding-tooltip")
                page.evaluate("Forge8UI.closeTips(document); goToPage('dashboard')")
                page.locator("#f8HomeRoot .f8-info").first.click()
                assert page.locator("#f8HomeRoot .f8-tip:not([hidden])").count() == 1
                audit("home-tooltip")
                page.evaluate("Forge8UI.closeTips(document); goToPage('deep-lesson')")
                page.locator("[data-f8-alternative]").click()
                assert page.locator(".f8-alt").is_visible()
                audit("lesson-alternative")
                for tab in ("livros", "pdfs", "resumos", "catalogo"):
                    page.evaluate("goToPage('library')")
                    page.locator(f"[data-f8-tab='{tab}']").click()
                    assert page.locator("[role='tabpanel']").count() == 1, tab
                    audit(f"library-tab-{tab}")

                # FORGE 9.0 — quatro abas do catálogo AssaadFlix.
                for tab in ("tecnicos", "classicos", "resumoes", "exercicios"):
                    page.evaluate("goToPage('flix')")
                    page.locator(f"[data-f9-tab='{tab}']").click()
                    assert page.locator("[role='tabpanel']").count() == 1, tab
                    audit(f"flix-tab-{tab}")

                # FORGE 9.0 — aula das trilhas 13/14 no padrão Universo Narrado.
                for track in ("13", "14"):
                    page.evaluate("t => goToPage(t === '13' ? 'trilha13' : 'trilha14')", track)
                    page.locator("[data-f9-module]").first.click()
                    assert page.locator("[data-f9-lesson]").count() == 1, track
                    audit(f"trilha{track}-lesson")

                # FORGE 9.0 — detalhe de resumão com exercícios e síntese Feynman.
                page.evaluate("goToPage('flix')")
                page.locator("[data-f9-book]").first.click()
                assert page.locator("[data-f9-book-detail]").count() == 1
                assert page.evaluate("page === 'book-summary'")
                audit("book-summary-detail")
                page.locator("[data-f9-exercises]").first.evaluate("el => el.open = true")
                audit("book-summary-exercises")

                if errors:
                    print(f"ERROS JS em {label}/{theme}: {errors[:3]}")
                    failures.append((f"{label}/{theme}/pageerror", errors[:3]))
                context.close()
        browser.close()
    print(f"\n{total - len([f for f in failures if not f[0].endswith('pageerror')])}/{total} cenários sem violações axe-core.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())

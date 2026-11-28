# -*- coding: utf-8 -*-
"""Validação real em browser da Fase 1 da FORGE (somente servidor local)."""
import datetime
import json
import os
import sys
import tempfile
import traceback

from playwright.sync_api import sync_playwright

BASE = os.environ.get("FORGE_BASE", "http://127.0.0.1:8765/index.html")
SAMPLE = (
    "Cache HTTP reduz latência. Por exemplo, uma resposta pode ser reutilizada. "
    "Segundo a especificação, Cache-Control define a validação. "
    "A latência cai quando há revalidação."
)
SHOT_DIR = os.path.join(tempfile.gettempdir(), "opencode")
SHOT_DESKTOP = os.path.join(SHOT_DIR, "forge_study_desktop.png")
SHOT_MOBILE = os.path.join(SHOT_DIR, "forge_study_mobile.png")
os.makedirs(SHOT_DIR, exist_ok=True)

results = []


def make_pdf(text):
    """PDF mínimo válido, com uma página e texto selecionável, para teste local."""
    import textwrap
    lines = textwrap.wrap(text, width=58) or [text]
    commands = ["BT", "/F1 12 Tf"]
    for index, line in enumerate(lines):
        safe = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        commands.append(f"1 0 0 1 72 {740 - index * 22} Tm ({safe}) Tj")
    commands.append("ET")
    stream = ("\n".join(commands) + "\n").encode("latin-1")
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"endstream",
    ]
    out = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = []
    for number, body in enumerate(objects, 1):
        offsets.append(len(out))
        out += str(number).encode() + b" 0 obj\n" + body + b"\nendobj\n"
    startxref = len(out)
    out += b"xref\n0 " + str(len(objects) + 1).encode() + b"\n"
    out += b"0000000000 65535 f \n"
    for offset in offsets:
        out += ("%010d 00000 n \n" % offset).encode()
    out += b"trailer\n<< /Size " + str(len(objects) + 1).encode() + b" /Root 1 0 R >>\n"
    out += b"startxref\n" + str(startxref).encode() + b"\n%%EOF\n"
    path = os.path.join(SHOT_DIR, "forge_browser_sample.pdf")
    with open(path, "wb") as handle:
        handle.write(out)
    return path


def check(name, fn):
    try:
        detail = fn() or ""
        results.append(("PASS", name, str(detail)[:300]))
    except Exception as exc:
        frame = traceback.extract_tb(exc.__traceback__)[-1]
        detail = f"{type(exc).__name__}@{frame.lineno}: {exc}"
        msg = " ".join(detail.split())[:400]
        results.append(("FAIL", name, msg))


def session_of(page):
    key = page.evaluate("Storage.get().study.lastSessionKey")
    return page.evaluate("k => Storage.get().study.sessions[k]", key)


def wait_ready(page):
    """Aguarda o carregamento dos módulos diferidos do app.js.

    O primeiro paint acontece antes deles (para manter o LCP baixo), então um
    intervalo fixo após domcontentloaded não é suficiente para as asserções.
    """
    page.wait_for_function("() => window.__forgeReady === true", timeout=30000)


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900}, locale="pt-BR")
    page = context.new_page()
    console_errors = []
    page_errors = []
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: page_errors.append(str(e)))

    page.goto(BASE, wait_until="domcontentloaded")
    wait_ready(page)

    def c_initial():
        n = page.locator("#nav button[data-page]").count()
        groups = page.locator("#nav .f8-nav-group").count()
        heads = page.locator("#nav .f8-group-head[aria-label]").count()
        assert n == 27, f"nav={n}"
        assert groups == 6 and heads == 6, f"grupos={groups}, cabeçalhos={heads}"
        return f"nav={n} em {groups} grupos"

    check("carregamento inicial e 27 destinos em 6 grupos na navegação", c_initial)

    def c_study():
        page.evaluate("goToPage('study')")
        assert page.locator("#pageTitle").inner_text() == "Aprenda a estudar"
        assert page.locator(".study-tabs button").count() == 5
        text = page.locator("#view").inner_text()
        assert "Privacidade e limites" in text
        assert "Nada é enviado a API externa" in text
        return "5 abas, aviso de privacidade presente"

    check("página 'Aprenda a estudar' e aviso de privacidade", c_study)

    def c_tutorial_steps():
        page.evaluate("Study.setTab('tutorial')")
        for i in range(9):
            page.evaluate(f"Study.tutorialGo({i})")
            assert page.locator(".study-step.current").count() == 1, f"passo {i}"
            assert page.locator(".study-step.current .study-step-body").count() == 1, f"corpo {i}"
        page.evaluate("Study.tutorialGo(0)")
        page.get_by_role("button", name="Próxima →").first.click()
        assert "Defina o objetivo" in page.locator(".study-step.current").inner_text()
        page.locator(".study-step-head").nth(2).click()
        assert "Leia uma seção pequena" in page.locator(".study-step.current").inner_text()
        return "9 etapas renderizadas; Próxima e cabeçalho clicáveis"

    check("tutorial: 9 etapas, avanço e retorno", c_tutorial_steps)

    def c_tutorial_persist():
        page.evaluate("Study.tutorialGo(0)")
        page.fill("#tut_topic", "3.2 Estruturas")
        page.evaluate("Study.tutorialSave(0)")
        st = session_of(page)
        assert st.get("tutorialTopic") == "3.2 Estruturas", st.get("tutorialTopic")
        assert st.get("tutorialDone", {}).get("0") is True
        page.reload(wait_until="domcontentloaded")
        wait_ready(page)
        page.evaluate("goToPage('study')")
        page.evaluate("Study.setTab('tutorial')")
        page.evaluate("Study.tutorialGo(0)")
        assert page.input_value("#tut_topic") == "3.2 Estruturas"
        return "sobreviveu a reload"

    check("tutorial: persistência e retomada após reload", c_tutorial_persist)

    def c_session_steps():
        page.evaluate("Study.setTab('session')")
        for i in range(7):
            page.evaluate(f"Study.sessionGo({i})")
            assert page.locator("#studyPanel .study-steps-tabs button[aria-pressed='true']").count() == 1, i
        return "7 passos com estado de seleção consistente"

    check("sessão guiada: 7 passos e navegação", c_session_steps)

    def c_session_flow():
        page.evaluate("Study.sessionGo(1)")
        page.fill("#s_section", "Cap. 3")
        page.fill("#s_text", SAMPLE)
        page.evaluate("Study.sessionSave(1,'read')")
        st = session_of(page)
        assert "Cache HTTP reduz latência" in st.get("text", "")
        assert st.get("steps", {}).get("read") is True
        page.evaluate("Study.sessionGo(3)")
        page.evaluate("Study.generateSessionQuestions()")
        assert page.locator("#s_questions .study-question").count() >= 3
        page.get_by_role("button", name="Mostrar conferência").click()
        assert page.locator("#s_reveal .study-answer").count() >= 3
        page.evaluate("Study.sessionGo(5)")
        page.evaluate("Study.makeSummary()")
        assert "[trecho]" in page.locator("#s_summary").inner_text()
        return "leitura, perguntas, conferência e resumo OK"

    check("sessão guiada: leitura, recuperação e resumo", c_session_flow)

    def c_session_explain_review():
        page.evaluate("Study.sessionGo(2)")
        text = ("Explicação própria com mais de oitenta caracteres sobre o tema lido e sobre "
                "como a reutilização de uma resposta reduz a latência sem consultar o texto original.")
        page.fill("#s_explain", text)
        page.evaluate("Study.saveExplanation()")
        st = session_of(page)
        assert st.get("explain") == text
        assert "Livro ·" in page.evaluate("JSON.stringify(Storage.get().notes||{})")
        page.evaluate("Study.sessionGo(6)")
        page.evaluate("Study.scheduleReview('session')")
        st = session_of(page)
        due = (datetime.date.today() + datetime.timedelta(days=7)).isoformat()
        assert st.get("reviewDue") == due, (st.get("reviewDue"), due)
        return f"explicação no Feynman; revisão em {due}"

    check("sessão guiada: explicação, Feynman e revisão agendada", c_session_explain_review)

    MODES = [
        ("explain", [("tutorTerm", "Cache", False)]),
        ("confused", [("tutorIssue", "termo", True)]),
        ("zero", [("tutorTrack", "c", True)]),
        ("example", []),
        ("test", []),
        ("exercises", [("tutorTrack", "c", True)]),
        ("reasoning", [("tutorReasoning", "Resolvi usando a definição de cache porque a resposta é reutilizável; primeiro identifiquei a latência e depois a revalidação.", False)]),
        ("feynman", [("tutorTerm", "cache", False), ("tutorFeynman", "Explicação própria com mais de oitenta caracteres sobre porque o cache reduz latência ao reutilizar uma resposta.", False)]),
        ("summary", []),
        ("compare", [("tutorA", "Cache", False), ("tutorB", "latência", False)]),
        ("application", [("tutorTrack", "c", True)]),
        ("read", [("tutorChunkSize", "800", True)]),
    ]

    def c_tutor_modes():
        page.evaluate("Study.setTab('tutor')")
        assert page.locator("#studyPanel .study-steps-tabs button").count() == 12
        for mode, fields in MODES:
            page.evaluate(f"Study.setTutorMode('{mode}')")
            page.fill("#tutorText", SAMPLE)
            for fid, value, is_select in fields:
                if is_select:
                    page.select_option("#" + fid, value)
                else:
                    page.fill("#" + fid, value)
            page.evaluate("Study.runTutor()")
            out = page.locator("#tutorOutput").inner_text()
            assert "Legenda da resposta" in out, f"{mode}: sem legenda"
            assert "undefined" not in out, f"{mode}: undefined"
            assert "NaN" not in out, f"{mode}: NaN"
            assert any(tag in out for tag in ["[trecho]", "[inferência]", "[sugestão]", "[não encontrado]"]), f"{mode}: sem proveniência"
        return "12/12 modos executados com proveniência"

    check("tutor: 12 modos com entradas realistas", c_tutor_modes)

    def c_tutor_edges():
        page.evaluate("Study.setTutorMode('explain')")
        page.fill("#tutorText", "")
        page.fill("#tutorTerm", "Cache")
        page.evaluate("Study.runTutor()")
        out = page.locator("#tutorOutput").inner_text()
        assert "Texto insuficiente" in out and "[não encontrado]" in out
        page.fill("#tutorText", SAMPLE)
        page.fill("#tutorTerm", "termoInexistenteXYZ")
        page.evaluate("Study.runTutor()")
        out = page.locator("#tutorOutput").inner_text()
        assert "[não encontrado]" in out
        assert "definição do termoInexistenteXYZ" not in out
        return "vazio e termo ausente sem invenção"

    check("tutor: entradas vazias e termo ausente", c_tutor_edges)

    def c_article():
        page.evaluate("Study.setTab('article')")
        page.fill("#art_title", "Artigo validação")
        page.fill("#art_doi", "10.0000/validacao")
        page.fill("#art_evidence", "Tabela 1")
        page.fill("#art_inference", "Minha inferência")
        page.evaluate("Study.saveArticle()")
        arts = page.evaluate("Storage.get().study.articles")
        assert any(a.get("title") == "Artigo validação" for a in arts.values())
        page.reload(wait_until="domcontentloaded")
        wait_ready(page)
        page.evaluate("goToPage('study')")
        page.evaluate("Study.setTab('article')")
        page.evaluate("Study.loadArticle('artigo-validacao')")
        assert page.input_value("#art_title") == "Artigo validação"
        assert page.input_value("#art_evidence") == "Tabela 1"
        return "salvamento e recuperação após reload OK"

    check("ficha de artigo: criação, salvamento e recuperação", c_article)

    def c_gaps():
        page.evaluate("Study.setTab('gaps')")
        before = page.evaluate("Storage.get().mistakes.length")
        page.select_option("#gapTrack", "c")
        page.fill("#gapText", "valor x endereço")
        page.select_option("#gapCategory", "E2")
        page.evaluate("Study.addManualGap()")
        after = page.evaluate("Storage.get().mistakes.length")
        assert after == before + 1, (before, after)
        gaps = page.evaluate("Storage.get().study.gaps")
        assert any(g.get("text") == "valor x endereço" for g in gaps)
        assert "Recuperação sugerida" in page.locator("#recoveryBox").inner_text()
        return f"erros {before}->{after}; recuperação sugerida"

    check("lacunas: persistência e recomendação", c_gaps)

    def c_books():
        page.evaluate("goToPage('books')")
        assert page.locator("#booksGrid button[onclick^='BookUI.open']").count() == 24
        assert page.locator("#booksGrid .study-book-btn").count() == 24
        assert page.locator("#booksGrid .book-card-status").count() == 24
        page.locator("#booksGrid button[onclick^='BookUI.open']").first.click()
        # renderDetail é assíncrono; o título muda antes do conteúdo do livro.
        page.wait_for_function("() => !!document.getElementById('bookImportInput') && document.getElementById('pageTitle').textContent.includes('Detalhe do livro')")
        text = page.locator("#view").inner_text()
        assert "Cálculo — Volume 1" in text
        assert "CC BY 4.0" in text
        assert "Abrir leitor interno" in text
        assert "Importar PDF do dispositivo" in text
        return "24 livros; detalhe interno com download/importação"

    check("biblioteca: 24 livros e detalhe integrado", c_books)

    def c_import_pdf():
        pdf_path = make_pdf("FORGE leitor integrado com questoes rastreaveis. Questoes extraidas da pagina 1 com referencia ao trecho original.")
        page.locator("#bookImportInput").set_input_files(pdf_path)
        page.wait_for_function("""() => {
            const b = Array.from(document.querySelectorAll('button'))
              .find(x => x.textContent.includes('Abrir leitor interno'));
            return b && !b.disabled;
        }""", timeout=15000)
        info = page.evaluate("""async () => {
            const id = BOOKS_META.idFor(BOOKS[0].title);
            const pdf = await BookStore.getPdf(id);
            return { size: pdf.size, valid: BookStore.validatePdfBytes(new Uint8Array(await pdf.blob.arrayBuffer())) };
        }""")
        assert info["valid"] and info["size"] > 500, info
        assert "concluído" in page.locator("#bookStatus").inner_text()
        return f"PDF validado e persistido ({info['size']} bytes)"

    check("PDF: importação real, validação e armazenamento", c_import_pdf)

    def c_extract_text():
        page.evaluate("BookUI.extract()")
        page.wait_for_function("""() => document.querySelector('#toast').textContent.includes('Texto extraído')""", timeout=30000)
        page.wait_for_function("""() => {
            const b = Array.from(document.querySelectorAll('button'))
              .find(x => x.textContent.includes('Gerar e responder questões'));
            return b && !b.disabled;
        }""", timeout=10000)
        data = page.evaluate("""async () => {
            const t = await BookStore.getText(BOOKS_META.idFor(BOOKS[0].title));
            return { pages: t.coverage, scanned: t.scanned, text: t.pages[0].text };
        }""")
        assert data["pages"] == 1 and not data["scanned"], data
        assert "FORGE leitor integrado" in data["text"], data["text"]
        return "1 página extraída com texto real"

    check("extração: PDF.js extrai texto associado à página", c_extract_text)

    def c_reader():
        page.evaluate("BookUI.openReader()")
        page.wait_for_selector("#readerCanvas", timeout=30000)
        page.wait_for_function("document.querySelector('#readerPageCount').textContent.includes('1 / 1')")
        width_before = page.evaluate("document.querySelector('#readerCanvas').style.width")
        assert page.evaluate("document.querySelector('#readerCanvas').width") > 100
        assert page.evaluate("BookReader.state.pdf.numPages") == 1
        page.evaluate("BookUI.zoom(0.2)")
        page.wait_for_function("w => document.querySelector('#readerCanvas').style.width !== w", arg=width_before)
        page.evaluate("BookUI.bookmark()")
        page.evaluate("""() => {
            const layer = document.getElementById('readerTextLayer');
            const sel = window.getSelection();
            sel.removeAllRanges();
            const range = document.createRange();
            range.selectNodeContents(layer);
            sel.addRange(range);
        }""")
        page.evaluate("document.querySelector('#readerNoteInput').value = 'Anotação de teste'")
        page.evaluate("BookUI.saveAnnotation()")
        page.wait_for_function("""async () => {
            const p = await BookStore.getProgress(BOOKS_META.idFor(BOOKS[0].title));
            return p.bookmarks.includes(1) && p.annotations.length > 0;
        }""", timeout=10000)
        page.fill("#readerSearchInput", "FORGE")
        page.wait_for_function("document.querySelector('#readerSearchInfo').textContent.includes('1 ocorrência')")
        assert page.locator("#readerSearchResults .linklike").count() >= 1
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(200)
        dims = page.evaluate("({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth})")
        assert dims["sw"] <= dims["cw"] + 2, dims
        page.set_viewport_size({"width": 1440, "height": 900})
        return "canvas renderizado, zoom, marcador, anotação, busca e mobile"

    check("leitor: renderização, zoom, marcador, anotação, busca e celular", c_reader)

    def c_questions_flow():
        page.evaluate("BookUI.openQuestions()")
        page.wait_for_function("document.getElementById('qChapter') && document.getElementById('questionsList')")
        page.evaluate("BookUI.generateQuestions()")
        page.wait_for_function("document.querySelectorAll('#questionsList .book-question').length === 5")
        sources = page.locator("#questionsList .book-question").all_inner_texts()
        assert all("Origem:" in s and "página 1" in s for s in sources), sources[:1]
        for i, qtype in enumerate(page.evaluate("BookReader.state.questions.map(q => q.type)")):
            card = page.locator("#questionsList .book-question").nth(i)
            if qtype in ("mc", "tf"):
                card.locator("input[type=radio]").first.check()
            else:
                card.locator("textarea").fill(
                    "Resposta escrita com base no trecho extraído da página 1 do livro."
                )
        page.evaluate("BookUI.gradeQuestions()")
        page.wait_for_function("document.querySelectorAll('#questionsResults .book-result').length === 5")
        perf = page.locator("#questionsPerformance").inner_text()
        assert "Questões respondidas: 5" in perf, perf
        assert "p. 1" in page.locator("#questionsResults").inner_text()
        assert "Revisar erros" in page.locator("#view").inner_text()
        return "5 questões com origem, correção e desempenho registrado"

    check("questões: geração local, resposta, correção e desempenho", c_questions_flow)

    def c_persistence():
        page.reload(wait_until="domcontentloaded")
        wait_ready(page)
        page.evaluate("goToPage('books')")
        page.locator("#booksGrid button[onclick^='BookUI.open']").first.click()
        page.wait_for_function("document.getElementById('bookStatus')?.textContent.includes('concluído')")
        state = page.evaluate("""async () => {
            const id = BOOKS_META.idFor(BOOKS[0].title);
            const p = await BookStore.getProgress(id);
            const q = await BookStore.getQuestions(id);
            return { lastPage: p.lastPage, answers: p.answered, questions: q.questions.length };
        }""")
        assert state["lastPage"] == 1, state
        assert state["answers"] >= 5, state
        assert state["questions"] == 5, state
        return "PDF, página, questões e desempenho sobreviveram ao reload"

    check("persistência: biblioteca e questões após recarregar", c_persistence)

    def c_router():
        keys = page.evaluate("Array.from(document.querySelectorAll('#nav button[data-page]')).map(b=>b.dataset.page)")
        assert len(keys) == 27, keys
        for key in keys:
            page.evaluate("k => goToPage(k)", key)
            title = page.locator("#pageTitle").inner_text().strip()
            assert title, f"página sem título: {key}"
        return "27/27 páginas renderizaram"

    check("roteador: todas as páginas existentes", c_router)

    def c_responsive():
        page.evaluate("goToPage('study')")
        bad = []
        for width in [1440, 1024, 900, 768, 640, 560, 390]:
            page.set_viewport_size({"width": width, "height": 900})
            page.wait_for_timeout(120)
            dims = page.evaluate("({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth})")
            if dims["sw"] > dims["cw"] + 2:
                bad.append((width, dims))
        assert not bad, bad
        page.set_viewport_size({"width": 1440, "height": 900})
        page.screenshot(path=SHOT_DESKTOP, full_page=False)
        page.set_viewport_size({"width": 390, "height": 844})
        page.screenshot(path=SHOT_MOBILE, full_page=False)
        page.set_viewport_size({"width": 1440, "height": 900})
        return "7 larguras sem overflow horizontal"

    check("responsividade: 1440/1024/900/768/640/560/390 px", c_responsive)

    def c_a11y():
        page.evaluate("goToPage('study')")
        assert page.locator("[role=tablist]").count() >= 1
        page.locator("#study-tab-tutor").click()
        selected = page.evaluate("Array.from(document.querySelectorAll('[role=tab]')).filter(b=>b.getAttribute('aria-selected')==='true').map(b=>b.id)")
        assert selected == ["study-tab-tutor"], selected
        assert page.locator("#studyPanel").get_attribute("aria-labelledby") == "study-tab-tutor"
        assert page.locator("#skip-link, .skip-link").count() >= 1
        return "tablist/aria-selected/aria-labelledby/skip-link OK"

    check("acessibilidade estrutural da página nova", c_a11y)

    def c_theme():
        before = page.evaluate("document.documentElement.dataset.theme")
        page.click("#themeBtn")
        after = page.evaluate("document.documentElement.dataset.theme")
        assert before != after, (before, after)
        page.evaluate("goToPage('study')")
        assert "Aprenda a estudar" in page.locator("#view").inner_text()
        return f"{before} -> {after}"

    check("tema claro/escuro não quebra a página nova", c_theme)

    def c_offline():
        page.evaluate("goToPage('study')")
        page.wait_for_function("navigator.serviceWorker && navigator.serviceWorker.controller !== null", timeout=20000)
        context.set_offline(True)
        try:
            page.reload(wait_until="domcontentloaded")
            wait_ready(page)
            page.evaluate("goToPage('study')")
            text = page.locator("#view").inner_text()
            assert "Tutorial em 9 etapas" in text, text[:200]
            return "reload offline renderizou a página e o módulo"
        finally:
            context.set_offline(False)

    check("PWA/offline: reload com rede desligada", c_offline)

    def c_offline_books():
        page.evaluate("goToPage('books')")
        context.set_offline(True)
        try:
            page.reload(wait_until="domcontentloaded")
            wait_ready(page)
            # PDF.js é carregado sob demanda por ForgePDF ao abrir o leitor.
            page.evaluate("goToPage('books')")
            page.locator("#booksGrid button[onclick^='BookUI.open']").first.click()
            page.wait_for_function("""() => {
                const b = Array.from(document.querySelectorAll('button'))
                  .find(x => x.textContent.includes('Abrir leitor interno'));
                return b && !b.disabled;
            }""", timeout=15000)
            page.evaluate("BookUI.openReader()")
            page.wait_for_selector("#readerCanvas", timeout=30000)
            assert page.evaluate("document.querySelector('#readerCanvas').width") > 100
            assert page.locator("#readerPageCount").inner_text().endswith("/ 1")
            return "PDF e PDF.js abriram sem rede"
        finally:
            context.set_offline(False)

    check("PWA/offline: leitor do PDF baixado sem rede", c_offline_books)

    def c_curriculum_real():
        page.evaluate("goToPage('study')")
        keys = page.evaluate("Object.keys(CURRICULUM)")
        assert len(keys) >= 5, keys
        page.evaluate("Study.setTab('tutor'); Study.setTutorMode('zero')")
        opts = page.locator("#tutorTrack option").count()
        assert opts >= 5, opts
        return f"{len(keys)} trilhas; {opts} opções no tutor"

    check("REGRESSÃO: tutor enxerga CURRICULUM real do navegador", c_curriculum_real)

    def c_invalid_route():
        page.evaluate("goToPage('studyy')")
        assert page.locator("#pageTitle").inner_text() == "Painel geral"
        assert page.locator("#nav button[data-page][aria-current='page']").get_attribute("data-page") == "dashboard"
        page.evaluate("goToPage('study')")
        return "rota inválida caiu no painel; rota válida restaurada"

    check("REGRESSÃO: goToPage rejeita página inexistente", c_invalid_route)

    def c_alt_arrow_typing():
        page.evaluate("Study.setTab('session'); Study.sessionGo(1)")
        page.fill("#s_text", "TEXTO PRESERVADO")
        page.locator("#s_text").dispatch_event("keydown", {"key": "ArrowRight", "altKey": True, "bubbles": True})
        assert page.locator("#pageTitle").inner_text() == "Aprenda a estudar"
        assert page.input_value("#s_text") == "TEXTO PRESERVADO"
        return "Alt+seta não navegou durante digitação"

    check("REGRESSÃO: atalho Alt+seta respeita campo de texto", c_alt_arrow_typing)

    def c_theme_keeps_unsaved():
        page.fill("#s_text", "TEXTO AINDA NAO SALVO")
        page.click("#themeBtn")
        page.evaluate("Study.setTab('session'); Study.sessionGo(1)")
        assert page.input_value("#s_text") == "TEXTO AINDA NAO SALVO"
        page.click("#themeBtn")
        return "texto não salvo preservado após render global"

    check("REGRESSÃO: re-render global preserva formulário", c_theme_keeps_unsaved)

    def c_book_session_preserved():
        page.evaluate("Study.startFromBook(0)")
        page.evaluate("Study.sessionGo(1)")
        page.fill("#s_text", "TEXTO DO LIVRO PRESERVADO")
        page.evaluate("Study.sessionSave(1,'read')")
        page.evaluate("Study.startFromBook(0)")
        assert session_of(page).get("text") == "TEXTO DO LIVRO PRESERVADO"
        return "segundo clique no mesmo livro não apagou a sessão"

    check("REGRESSÃO: 'Estudar este livro' preserva sessão existente", c_book_session_preserved)

    def c_no_key_leak():
        page.evaluate("Study.newSession()")
        assert "__key" not in session_of(page)
        return "__key ausente no estado persistido"

    check("REGRESSÃO: chave interna não vaza para Storage", c_no_key_leak)

    def c_checklist_uncheck():
        page.evaluate("Study.sessionGo(2)")
        page.locator("#sc0").check()
        page.evaluate("Study.sessionGo(1)")
        assert session_of(page).get("checks", {}).get("c0") is True
        page.evaluate("Study.sessionGo(2)")
        page.locator("#sc0").uncheck()
        page.evaluate("Study.sessionGo(1)")
        assert session_of(page).get("checks", {}).get("c0") is False
        return "marcação e desmarcação persistidas"

    check("REGRESSÃO: checklist pode ser desmarcado", c_checklist_uncheck)

    def c_tutor_clear():
        page.evaluate("Study.setTab('tutor'); Study.setTutorMode('explain')")
        page.fill("#tutorText", "TEXTO ANTIGO QUE DEVERIA DESAPARECER")
        page.fill("#tutorText", "")
        page.evaluate("Study.runTutor()")
        out = page.locator("#tutorOutput").inner_text()
        assert "Texto insuficiente" in out, out[:200]
        return "campo vazio não resgata texto antigo"

    check("REGRESSÃO: texto do tutor pode ser esvaziado", c_tutor_clear)

    def c_question_context():
        page.evaluate("Study.setTab('tutorial'); Study.tutorialGo(2)")
        page.fill("#tut_text", "Cache é bom. UDP é rápido. TCP é estável.")
        page.evaluate("Study.generateTutorialQuestions()")
        page.evaluate("Study.tutorialGo(6)")
        page.evaluate("Study.revealAnswers()")
        out = page.locator("#tut_check").inner_text()
        assert "[não encontrado]" in out, out[:300]
        assert "[trecho] Termo identificado" not in out, out[:300]
        return "fallback de pergunta não é rotulado como trecho"

    check("REGRESSÃO: proveniência das perguntas é honesta", c_question_context)

    def c_xss_gap_category():
        page.evaluate("""() => {
          const s = Storage.get();
          s.study.gaps.push({ kind: 'manual', source: 'teste', text: 'injeção', category: 'x" onmouseover="alert(1)' });
          Storage.save();
        }""")
        page.evaluate("goToPage('study'); Study.setTab('gaps')")
        html = page.locator("#view").inner_html()
        assert 'onmouseover="alert(1)"' not in html, html[:300]
        return "categoria maliciosa não virou atributo HTML"

    check("REGRESSÃO: categoria de lacuna escapada/whitelist", c_xss_gap_category)

    def c_xss_history():
        page.evaluate("""() => {
          const s = Storage.get();
          s.study.tutor['evil-test'] = { mode: 'explain', at: new Date().toISOString(), text: '<img src=x onerror=alert(1)>' };
          Storage.save();
        }""")
        page.evaluate("Study.setTab('tutor'); Study.showHistory('evil-test')")
        html = page.locator("#tutorOutput").inner_html()
        assert "<img" not in html and "&lt;img" in html, html[:300]
        return "histórico malicioso renderizado como texto escapado"

    check("REGRESSÃO: histórico do tutor sem XSS persistido", c_xss_history)

    def c_corrupt_backup():
        p2 = browser.new_context(viewport={"width": 900, "height": 700}).new_page()
        p2.goto(BASE, wait_until="domcontentloaded")
        wait_ready(p2)
        p2.evaluate("localStorage.setItem('forge.study.v9', '{broken')")
        p2.reload(wait_until="domcontentloaded")
        wait_ready(p2)
        backup = p2.evaluate("localStorage.getItem('forge.study.v2.lastBackup')")
        assert backup and '"corrupted":true' in backup and "{broken" in backup, (backup or "")[:300]
        versioned = p2.evaluate("Object.keys(localStorage).filter(k => k.startsWith('forge.study.v9.bak_'))")
        assert len(versioned) == 1, versioned
        p2.context.close()
        return "JSON corrompido preservado em forge.study.v2.lastBackup e forge.study.v9.bak_"

    check("REGRESSÃO: estado corrompido gera backup antes de resetar", c_corrupt_backup)

    def c_import_future_rejected():
        r = page.evaluate("""async () => {
          const antes = JSON.stringify(Storage.get());
          const backup = localStorage.getItem('forge.study.v2.lastBackup');
          const file = new File([JSON.stringify({version: 10, state: {version: 10, done: ['futuro'], xp: 9999}})],
                                'futuro.json', {type: 'application/json'});
          let code = null;
          try { await Storage.import(file); } catch (err) { code = err.code || 'SEM_CODIGO'; }
          return {
            code: code,
            toast: document.getElementById('toast').textContent,
            estadoIgual: JSON.stringify(Storage.get()) === antes,
            backupIgual: localStorage.getItem('forge.study.v2.lastBackup') === backup
          };
        }""")
        assert r["code"] == "FUTURE_VERSION", r
        assert r["estadoIgual"] is True, r
        assert r["backupIgual"] is True, r
        assert "v10" in r["toast"] and "preservados" in r["toast"], r
        return "v10 recusada; estado e backup intactos; aviso claro"

    check("IMPORTAÇÃO: versão futura recusada sem perda de dados", c_import_future_rejected)

    def c_import_valid_migration():
        r = page.evaluate("""async () => {
          const file = new File([JSON.stringify({version: 2, state: {version: 2, done: ['importado'], xp: 555, plan: {goal: 'meta'}}})],
                                'v2.json', {type: 'application/json'});
          await Storage.import(file);
          const s = Storage.get();
          return {
            version: s.version, done: s.done, xp: s.xp, goal: s.plan.goal,
            toast: document.getElementById('toast').textContent,
            backup: !!localStorage.getItem('forge.study.v2.lastBackup')
          };
        }""")
        assert r["version"] == 9 and r["done"] == ["importado"] and r["xp"] == 555, r
        assert r["goal"] == "meta" and r["backup"] is True, r
        assert "v2 → v9" in r["toast"], r
        return "v2 migrada para v9 com backup e aviso"

    check("IMPORTAÇÃO: versão compatível ainda migra com backup", c_import_valid_migration)

    def c_v4_to_v5_migration():
        p3 = browser.new_context(viewport={"width": 900, "height": 700}).new_page()
        p3.goto(BASE, wait_until="domcontentloaded")
        wait_ready(p3)
        p3.evaluate("""() => {
          localStorage.clear();
          localStorage.setItem('forge.study.v4', JSON.stringify({
            version: 4, userId: 'usr_teste_v4', done: ['aula-1'], xp: 321,
            mastery: { 'aula-1': { score: 9, mastered: true } },
            feynman: { 'aula-1': 'Sintese com mais de trinta caracteres validos nesta frase.' },
            cards: { 'aula-1': { interval: 6, repetition: 2, efactor: 2.5, next_review: 1709718400000 } }
          }));
        }""")
        p3.reload(wait_until="domcontentloaded")
        wait_ready(p3)
        r = p3.evaluate("""() => {
          const s = Storage.get();
          const keys = Object.keys(localStorage).filter(k => k.startsWith('forge.study.v4.bak_'));
          const marker = JSON.parse(localStorage.getItem('forge.study.v5.migration') || 'null');
          const backup = keys.length ? JSON.parse(localStorage.getItem(keys[0])) : null;
          return {
            version: s.version, userId: s.userId, done: s.done, xp: s.xp,
            sourceVersion: s.forge4 && s.forge4.sourceVersion,
            checksum: s.forge4 && s.forge4.sourceChecksum,
            lessonScore: s.progress.lessons['aula-1'] && s.progress.lessons['aula-1'].score,
            backupCount: keys.length,
            backupChecksum: backup && backup.checksum,
            backupAlgorithm: backup && backup.algorithm,
            markerStatus: marker && marker.status,
            v4Preserved: !!localStorage.getItem('forge.study.v4')
          };
        }""")
        assert r["version"] == 9 and r["userId"] == "usr_teste_v4", r
        assert r["done"] == ["aula-1"] and r["xp"] == 321 and r["lessonScore"] == 9, r
        assert r["sourceVersion"] == 4 and r["checksum"] == r["backupChecksum"], r
        assert r["backupAlgorithm"] == "FNV-1a-32" and r["backupCount"] == 1, r
        assert r["markerStatus"] == "complete" and r["v4Preserved"] is True, r
        p3.context.close()
        return "v4→v5→v7→v8→v9 atômica: backup, checksum, userId e progresso preservados"

    check("MIGRAÇÃO: v4→v5→v7→v8→v9 atômica com backup e checksum", c_v4_to_v5_migration)

    def c_forge4_widgets():
        page.evaluate("goToPage('dashboard')")
        r = page.evaluate("""() => ({
          heroes: document.querySelectorAll('#forge4Widgets .forge-hero').length,
          radar: document.querySelectorAll('#forge4Widgets .radar-row').length,
          nodes: document.querySelectorAll('#forge4Widgets .constellation svg circle').length,
          cells: document.querySelectorAll('#forge4Widgets .heatmap svg rect').length,
          bugs: document.querySelectorAll('#forge4Widgets #bugHuntCard').length,
          cta: (document.querySelector('#forge4Widgets .forge-hero__actions button') || {}).textContent || '',
          progress: document.querySelector('#forge4Widgets [role=progressbar]')?.getAttribute('aria-valuenow')
        })""")
        assert r["heroes"] == 1 and r["bugs"] == 1, r
        assert r["cells"] == 364 and r["nodes"] > 0 and r["radar"] >= 0, r
        assert r["cta"].strip() and r["progress"] is not None, r
        return f"hero, radar, {r['nodes']} nós, 364 células e caça-bugs presentes"

    check("FORGE 4.0: widgets do command center no painel", c_forge4_widgets)

    def c_forge4_oral():
        page.evaluate("goToPage('oral')")
        n = page.locator("#oralRoot .oral-topic").count()
        assert 3 <= n <= 5, n
        page.get_by_role("button", name="Iniciar prova").click()
        assert page.locator("#oralTimer").count() == 1
        texto = ("Define o conceito central e apresenta um exemplo concreto. "
                 "Justifica cada passo da derivação com rigor e trata um limite conhecido. "
                 "Conclui com uma síntese curta, usando notação consistente em toda a resposta.")
        page.locator("#oralAnswer").fill(texto)
        for ident in ["exposicao-0", "exposicao-1", "exposicao-2", "raciocinio-0",
                      "raciocinio-1", "raciocinio-2", "comunicacao-0", "comunicacao-1"]:
            page.locator(f"#oral-{ident}").check()
        page.get_by_role("button", name="Finalizar e avaliar").click()
        r = page.evaluate("""() => ({
          total: Storage.get().oral_exam_history.length,
          last: Storage.get().oral_exam_history.slice(-1)[0] || {},
          shown: document.querySelector('#oralResultTitle')?.textContent || ''
        })""")
        assert r["total"] >= 1 and r["last"]["score"] >= 8.0 and r["last"]["passed"] is True, r
        assert "Aprovado" in r["shown"] and len(r["last"]["topics"]) >= 3, r
        return f"prova oral: nota {r['last']['score']}, {len(r['last']['topics'])} tópicos registrados"

    check("FORGE 4.0: prova oral com rubrica e histórico persistido", c_forge4_oral)

    def c_forge4_crypto():
        page.evaluate("goToPage('crypto')")
        assert page.locator("#cryptoCanvas").count() == 1
        page.evaluate("CryptoSim.setMode('lcg')")
        page.evaluate("CryptoSim.setParam('memoryKiB',1024); CryptoSim.setParam('iterations',3)")
        r = page.evaluate("""() => ({
          source: (CryptoSim.state.lastRun || {}).source || '',
          unique: Number(document.getElementById('cryptoUnique').textContent),
          entropy: Number(document.getElementById('cryptoEntropy').textContent),
          fields: document.querySelectorAll('#cryptoVault .crypto-byte').length,
          total: document.getElementById('cryptoTotal').textContent,
          saved: Storage.get().crypto_lab_state.mode,
          mem: Storage.get().crypto_lab_state.memoryKiB
        })""")
        assert "LCG" in r["source"] and 1 < r["unique"] <= 64, r
        assert r["entropy"] > 0 and r["fields"] == 6 and "Total:" in r["total"], r
        assert r["saved"] == "lcg" and r["mem"] == 1024, r
        return f"crypto: {r['unique']} bytes distintos, H={r['entropy']}, 6 campos no cofre"

    check("FORGE 4.0: laboratório crypto com entropia e cofre", c_forge4_crypto)

    def c_forge4_bugs():
        page.evaluate("goToPage('bugs')")
        fault = page.evaluate("ForgeWidgets4.dailyBug().fault")
        page.locator(f'input[name="bugLine"][value="{fault}"]').check()
        page.locator("#bugJustify").fill("A linha indicada não valida o limite e produz comportamento indefinido.")
        page.locator("#bugHuntCard button[type=submit]").click()
        r = page.evaluate("""() => ({
          history: Storage.get().bug_hunt_history.length,
          last: Storage.get().bug_hunt_history.slice(-1)[0] || {},
          autopsy: !document.getElementById('bugAutopsy').hidden,
          faultMarked: document.querySelectorAll('#bugAutopsy [data-line=fault]').length
        })""")
        assert r["history"] >= 1 and r["last"]["correct"] is True, r
        assert r["autopsy"] and r["faultMarked"] == 1, r
        return "caça-bugs: diagnóstico correto, autópsia e histórico persistidos"

    check("FORGE 4.0: caça-bugs diário com autópsia", c_forge4_bugs)

    def c_forge4_summaries_index():
        page.set_viewport_size({"width": 1440, "height": 900})
        page.evaluate("goToPage('summaries')")
        r = page.evaluate("""() => ({
          title: document.getElementById('pageTitle').textContent.trim(),
          total: BooksSummariesIndex.stats().summaries,
          books: document.querySelectorAll('#summaryIndex .summary-group').length,
          links: document.querySelectorAll('#summaryIndex .summary-link').length,
          status: document.querySelector('[role=status]')?.textContent || ''
        })""")
        assert r["title"] == "Livros & Resumos", r
        assert r["total"] == 233 and 1 <= r["books"] <= 13 and r["links"] == 40, r
        assert "233 resultados" in r["status"], r
        page.evaluate("SummariesPage.setQuery('combinatoria')")
        filtrado = page.evaluate("""() => ({
          status: document.querySelector('[role=status]')?.textContent || '',
          groups: document.querySelectorAll('#summaryIndex .summary-group').length
        })""")
        assert "resultado" in filtrado["status"] and filtrado["groups"] >= 1, filtrado
        page.evaluate("SummariesPage.setQuery('')")
        page.set_viewport_size({"width": 390, "height": 900})
        page.wait_for_timeout(120)
        overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        assert overflow <= 1, overflow
        page.set_viewport_size({"width": 1440, "height": 900})
        return f"233 resumos, 13 livros, filtro por busca e 390px sem overflow"

    check("FORGE 4.0: aba Livros & Resumos com índice e filtros", c_forge4_summaries_index)

    def c_forge4_summaries_reader():
        page.evaluate("SummariesPage.open('FME_1/cap01')")
        page.wait_for_selector("#summaryArticle h3", timeout=8000)
        r = page.evaluate("""() => ({
          toc: document.querySelectorAll('.summary-toc a').length,
          headings: document.querySelectorAll('#summaryArticle h3').length,
          unicode: document.getElementById('summaryArticle').textContent.includes('ℕ'),
          scripts: document.querySelectorAll('#summaryArticle script').length,
          font: getComputedStyle(document.getElementById('summaryArticle')).fontSize,
          id: SummariesPage.state.currentId
        })""")
        assert r["toc"] >= 6 and r["headings"] >= 6 and r["unicode"], r
        assert r["scripts"] == 0 and r["id"] == "FME_1/cap01", r
        page.evaluate("SummariesPage.setFontSize(2)")
        r2 = page.evaluate("getComputedStyle(document.getElementById('summaryArticle')).fontSize")
        assert float(r2.replace("px", "")) > float(r["font"].replace("px", "")), r2
        page.get_by_role("button", name="Marcar como lido").click()
        saved = page.evaluate("Storage.get().forge4.summaryProgress['FME_1/cap01'] || {}")
        assert saved.get("read") is True, saved
        page.keyboard.press("ArrowRight")
        nxt = page.evaluate("SummariesPage.state.currentId")
        assert nxt == "FME_1/cap02", nxt
        page.keyboard.press("Escape")
        voltou = page.evaluate("""() => ({
          id: SummariesPage.state.currentId,
          index: document.querySelectorAll('#summaryIndex .summary-link').length
        })""")
        assert voltou["id"] is None and voltou["index"] == 40, voltou
        return f"leitor com {r['toc']} seções, Unicode, teclado e progresso persistido"

    check("FORGE 4.0: leitor de resumo com TOC, teclado e progresso", c_forge4_summaries_reader)

    def c_forge4_offline_summaries():
        page.wait_for_function("navigator.serviceWorker && navigator.serviceWorker.controller !== null", timeout=20000)
        cached = page.evaluate("""async () => {
          const keys = await caches.keys();
          const key = keys.find(k => k.startsWith('forge-v10'));
          if (!key) return { keys, key: null, found: false, total: 0 };
          const cache = await caches.open(key);
          const found = Boolean(await cache.match('./saida/02_resumos_por_livro/FME_1/cap01.md'));
          return { keys, key, found, total: (await cache.keys()).length };
        }""")
        assert cached["key"], cached
        assert cached["found"] and cached["total"] >= 233, cached
        assert all(k.startswith("forge-v10") for k in cached["keys"]), cached
        context.set_offline(True)
        try:
            page.evaluate("SummariesPage.open('FME_1/cap01')")
            page.wait_for_selector("#summaryArticle h3", timeout=10000)
            offline = page.evaluate("""() => ({
              headings: document.querySelectorAll('#summaryArticle h3').length,
              unicode: document.getElementById('summaryArticle').textContent.includes('ℕ')
            })""")
            assert offline["headings"] >= 6 and offline["unicode"], offline
        finally:
            context.set_offline(False)
            page.evaluate("SummariesPage.back()")
        return f"cache forge-v10 com {cached['total']} entradas; resumo lido offline"

    check("PWA/offline: resumo do acervo no cache forge-v9", c_forge4_offline_summaries)

    def c_forge4_plan_six_phases():
        page.evaluate("goToPage('plan')")
        page.wait_for_selector("#planPhases .plan-phase", timeout=10000)
        info = page.evaluate("""() => {
          const nodes = [...document.querySelectorAll('#planPhases .plan-phase')];
          const evidence = Plan.phaseEvidence();
          return {
            count: nodes.length,
            keys: Plan.phases.map(p => p.key),
            evidenceKeys: Object.keys(evidence),
            labels: nodes.map(n => n.querySelector('h3').textContent.trim()),
            checkboxes: nodes.filter(n => n.querySelector('input[type=checkbox][aria-label]')).length,
            ctas: nodes.filter(n => n.querySelector('button')).length
          };
        }""")
        assert info["count"] == 6, info
        assert info["keys"] == ["diagnostico", "fundamentos", "pratica", "recuperacao", "exposicao", "dominio"], info
        assert all(k in info["evidenceKeys"] for k in info["keys"]), info
        assert info["checkboxes"] == 6 and info["ctas"] == 6, info
        # Marcação manual persiste sem apagar evidência das aulas.
        page.evaluate("Plan.togglePhase('fundamentos', true)")
        persisted = page.evaluate("""() => {
          const s = Storage.get();
          return { flag: !!s.plan.phases.fundamentos, done: Array.isArray(s.done) ? s.done.length : 0 };
        }""")
        assert persisted["flag"] and persisted["done"] >= 0, persisted
        page.evaluate("Plan.togglePhase('fundamentos', false)")
        return f"6 fases com evidência local; marcação persistida (done={persisted['done']})"

    check("FORGE 4.0: plano de estudo em 6 fases com evidência local", c_forge4_plan_six_phases)

    # ---------------- FORGE 8.0 ----------------

    def c_f8_onboarding_home_tooltip():
        ctx8 = browser.new_context(viewport={"width": 1440, "height": 900}, locale="pt-BR")
        p8 = ctx8.new_page()
        p8.goto(BASE, wait_until="domcontentloaded")
        wait_ready(p8)
        assert p8.locator("#f8Onboard").count() == 1
        assert p8.locator("#f8Onboard [data-f8-onboard-step='0']").is_visible()
        p8.locator("#f8Onboard .f8-info").first.click()
        assert p8.locator("#f8Onboard .f8-tip:not([hidden])").count() == 1
        assert p8.locator("#f8Onboard .f8-info").first.get_attribute("aria-expanded") == "true"
        p8.get_by_role("button", name="Próximo passo →").click()
        assert p8.locator("#f8Onboard [data-f8-onboard-step='1']").is_visible()
        assert p8.locator("#f8Onboard [data-f8-entry]").count() == 3
        p8.locator("[data-f8-entry='placement']").click()
        p8.get_by_role("button", name="Próximo passo →").click()
        assert p8.locator("#f8Onboard [data-f8-goal]").count() == 3
        p8.locator("[data-f8-goal='leve']").click()
        p8.get_by_role("button", name="Começar minha primeira aula →").click()
        r = p8.evaluate("""() => ({
          first: Storage.get().isFirstVisit,
          entry: Storage.getForge8State().onboarding.entryPoint,
          goal: Storage.getForge8State().onboarding.dailyGoal,
          completed: !!Storage.getForge8State().onboarding.completedAt,
          minutes: Storage.get().user_profile.daily_goal_minutes,
          onboard: !!document.getElementById('f8Onboard')
        })""")
        assert r["first"] is False and r["completed"] and not r["onboard"], r
        assert r["entry"] == "placement" and r["goal"] == "leve" and r["minutes"] == 30, r
        assert p8.evaluate("document.getElementById('pageTitle').textContent") == "Aprenda a estudar"
        p8.evaluate("goToPage('dashboard')")
        home = p8.evaluate("""() => ({
          cycle: [...document.querySelectorAll('.f8-cycle li')].map(n => n.textContent.trim()),
          heroes: document.querySelectorAll('.f8-hero-card').length,
          ctas: document.querySelectorAll('.f8-hero-card .f8-primary').length,
          cards: document.querySelectorAll('#f8HomeRoot .f8-mini-card').length,
          advancedOpen: document.querySelector('.f8-advanced')?.open
        })""")
        assert len(home["cycle"]) == 4 and home["heroes"] == 1 and home["ctas"] == 1, home
        assert home["cards"] == 2 and home["advancedOpen"] is False, home
        p8.evaluate("Storage.get().done.push('primeira-aula'); Storage.save(); goToPage('dashboard')")
        assert p8.locator(".f8-advanced").get_attribute("open") is not None
        ctx8.close()
        return "3 etapas, micro-card, meta 30 min e ferramentas avançadas desbloqueadas após 1 aula"

    check("FORGE 8.0: onboarding, home em 3 blocos e micro-card", c_f8_onboarding_home_tooltip)

    def c_f8_lesson_12_rules():
        page.evaluate("goToPage('deep-lesson')")
        r = page.evaluate("""() => ({
          rules: document.querySelectorAll('.f8-deep-block[data-f8-rule]').length,
          named: [...document.querySelectorAll('.f8-rule-name')].filter(n => n.textContent.includes('Regra ')).length,
          checks: document.querySelectorAll('[data-f8-check]').length,
          title: document.querySelector('#view h1')?.textContent || '',
          terms: document.querySelectorAll('#view .f8-info').length
        })""")
        assert r["rules"] == 12 and r["named"] == 11, r
        assert r["checks"] >= 2 and r["terms"] >= 4, r
        assert "ponteiros" in r["title"].lower(), r
        page.locator("[data-f8-check='0'] [data-f8-option='0']").click()
        feedback = page.locator("[data-f8-check='0'] .f8-feedback").inner_text()
        assert feedback and page.locator("[data-f8-check='0'] .f8-hint").is_visible()
        page.locator("[data-f8-alternative]").click()
        assert page.locator(".f8-alt").is_visible()
        page.locator("#f8Feynman").fill("curto")
        page.locator("[data-f8-feynman]").click()
        assert "Precisa de ao menos" in page.locator("[data-f8-feynman-feedback]").inner_text()
        page.locator("#f8Feynman").fill(
            "O ponteiro guarda o endereço da variável na memória; a CPU lê esse endereço "
            "para encontrar o valor e atualiza o registrador com a posição indicada.")
        page.locator("[data-f8-feynman]").click()
        assert "Síntese registrada" in page.locator("[data-f8-feynman-feedback]").inner_text()
        return f"12 blocos, {r['checks']} checagens, alternativa e Feynman validados"

    check("FORGE 8.0: aula Universo Narrado com 12 regras e checagens", c_f8_lesson_12_rules)

    def c_f8_library_tabs():
        page.evaluate("goToPage('library')")
        assert page.locator("[data-f8-tab]").count() == 4
        assert page.locator("[role='tab'][aria-selected='true']").count() == 1
        page.locator("[data-f8-tab='resumos']").click()
        assert page.locator("[data-f8-tab='resumos']").get_attribute("aria-selected") == "true"
        assert page.locator("[role='tabpanel']").count() == 1
        page.locator("[data-f8-tab='catalogo']").click()
        assert page.locator("#f8-panel-catalogo [data-f8-tab]").count() == 0
        stored = page.evaluate("Storage.getForge8State().library.activeTab")
        assert stored == "catalogo", stored
        page.locator("[data-f8-tab='livros']").click()
        return "4 abas na mesma rota, estado persistido e painéis sem duplicação"

    check("FORGE 8.0: biblioteca unificada em 4 abas", c_f8_library_tabs)

    def c_f8_v7_to_v8_atomic():
        ctx9 = browser.new_context(viewport={"width": 900, "height": 700}, locale="pt-BR")
        p9 = ctx9.new_page()
        p9.goto(BASE, wait_until="domcontentloaded")
        wait_ready(p9)
        p9.evaluate("""() => {
          localStorage.clear();
          localStorage.setItem('forge.study.v7', JSON.stringify({
            version: 7, versionString: '7.0.0', userId: 'usr_v8_atomico',
            done: ['aula-v7'], xp: 432,
            mastery: { 'aula-v7': { score: 9, mastered: true } },
            feynman: { 'aula-v7': 'Explicação com mais de trinta caracteres preservada na migração.' },
            forge7: { userSeed: 123456789 }
          }));
        }""")
        p9.reload(wait_until="domcontentloaded")
        wait_ready(p9)
        r = p9.evaluate("""() => {
          const s = Storage.get();
          const bak = Object.keys(localStorage).filter(k => k.indexOf('forge.study.v7.bak_') === 0);
          return {
            version: s.version, userId: s.userId, done: s.done, xp: s.xp,
            seed7: s.forge7 && s.forge7.userSeed, seed8: s.forge8 && s.forge8.userSeed,
            first: s.isFirstVisit, advanced: s.forge8 && s.forge8.advancedRevealed,
            tmp: localStorage.getItem('forge.study.v8.tmp'),
            backups: bak.length, v7preserved: !!localStorage.getItem('forge.study.v7'),
            lessonScore: s.progress.lessons['aula-v7'] && s.progress.lessons['aula-v7'].score,
            feynman: s.feynman['aula-v7']
          };
        }""")
        assert r["version"] == 9 and r["userId"] == "usr_v8_atomico", r
        assert r["done"] == ["aula-v7"] and r["xp"] == 432 and r["lessonScore"] == 9, r
        assert r["seed8"] == (1664525 * r["seed7"] + 1013904223) % (2 ** 32), r
        assert r["backups"] == 1 and r["v7preserved"] and r["tmp"] is None, r
        assert r["first"] is False and r["advanced"] is True, r
        assert "trinta caracteres" in r["feynman"], r
        ctx9.close()
        return "v7→v8→v9 atômico: backup, LCG, userId, domínio e Feynman preservados"

    check("FORGE 9.0: migração v7→v8→v9 atômica com LCG e invariante de domínio", c_f8_v7_to_v8_atomic)

    browser.close()

print("\n".join(f"{s} | {n} | {d}" for s, n, d in results))
passed = sum(1 for s, _, _ in results if s == "PASS")
print(f"\n{passed}/{len(results)} verificações de browser passaram.")
print(f"console.error (online): {len(console_errors)}")
for e in console_errors[:8]:
    print("  CONSOLE:", " ".join(e.split())[:220])
print(f"pageerror: {len(page_errors)}")
for e in page_errors[:8]:
    print("  PAGEERROR:", " ".join(str(e).split())[:220])
sys.exit(0 if passed == len(results) else 1)

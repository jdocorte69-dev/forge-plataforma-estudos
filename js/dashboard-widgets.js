/* ============================================================
   FORGE 7.0 — dashboard-widgets.js
   Command center: hero de prioridade, radar SM-2, grafo de
   pré-requisitos, heatmap 52×7 e caça-bugs diário com quatro
   categorias (C, assembly, TCP/IP e cripto). Determinístico e local.
   Expõe window.ForgeWidgets4 (API preservada).
   ============================================================ */

(function () {
  "use strict";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function num(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : (fallback || 0);
  }

  function hash(value) {
    if (typeof window !== "undefined" && window.ForgeMathUtils?.fnv1a32) {
      return window.ForgeMathUtils.fnv1a32(value) >>> 0;
    }
    let h = 2166136261 >>> 0;
    const s = String(value || "");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function next(seed) {
    return (Math.imul(seed >>> 0, 1664525) + 1013904223) >>> 0;
  }

  function state() {
    return (typeof Storage !== "undefined" && typeof Storage.get === "function") ? Storage.get() : {};
  }

  function userSeed() {
    const s = state();
    return num(s.forge4?.userSeed, hash(`forge-v5|${s.userId || "local"}`)) >>> 0;
  }

  function lessonList() {
    try {
      /* "lessons" é um binding lexical global definido por app.js. */
      if (typeof lessons !== "undefined" && Array.isArray(lessons) && lessons.length) return lessons;
    } catch (e) { /* binding lexical indisponível no contexto de teste */ }
    try {
      if (typeof buildAllLessons === "function") return buildAllLessons();
    } catch (e) { /* currículo não carregado */ }
    return [];
  }

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function seedFor(key) {
    return hash(`${userSeed()}|${key}`);
  }

  function go(page) {
    if (typeof goToPage === "function") goToPage(page);
    else if (typeof window !== "undefined" && typeof window.goToPage === "function") window.goToPage(page);
  }

  /* ---------- 1. Hero card: uma ação prioritária, sem ambiguidade ---------- */

  function priorityAction(s) {
    s = s || state();
    const now = Date.now();
    const cards = s.cards && typeof s.cards === "object" ? s.cards : {};
    const overdue = Object.entries(cards).filter(([, card]) => {
      const t = num(card?.next_review, 0);
      return t > 0 && t <= now;
    }).length;
    const history = Array.isArray(s.oral_exam_history) ? s.oral_exam_history : [];
    const bugs = Array.isArray(s.bug_hunt_history) ? s.bug_hunt_history : [];
    const bugToday = bugs.some(b => String(b.day || b.at || "").slice(0, 10) === todayISO());
    const oralRecent = history.some(h => (now - new Date(h.at || 0).getTime()) < 7 * 86400000);
    const total = lessonList().length;
    const done = Array.isArray(s.done) ? s.done.length : 0;
    const pct = total ? Math.round(done / total * 100) : 0;

    if (overdue > 0) {
      return {
        kicker: "Revisão espaçada · prioridade 1",
        title: `${overdue} ${overdue === 1 ? "cartão está" : "cartões estão"} pedindo revisão`,
        meta: ["SM-2 determinístico", "Recuperação antes de conteúdo novo"],
        progress: pct,
        label: "Revisar agora",
        page: "review",
        action: null
      };
    }
    if (!bugToday) {
      return {
        kicker: "Caça-bugs · rotina diária",
        title: "Encontre o defeito antes que ele vire hábito",
        meta: ["1 caso por dia", "Modo autópsia ao errar"],
        progress: pct,
        label: "Abrir caça-bugs",
        page: "bugs",
        action: null
      };
    }
    if (!oralRecent) {
      return {
        kicker: "Prova oral · recuperação ativa",
        title: "Explique em voz alta por 5 minutos",
        meta: ["3 a 5 tópicos", "Rubrica em três painéis"],
        progress: pct,
        label: "Iniciar prova oral",
        page: "oral",
        action: null
      };
    }
    return {
      kicker: "Próxima aula · sequência ordenada",
      title: "Continue de onde você parou",
      meta: [`${done} de ${total} aulas concluídas`, "Uma etapa por vez"],
      progress: pct,
      label: "Entrar no modo foco",
      page: "dashboard",
      action: "Focus.open"
    };
  }

  function heroHTML() {
    const a = priorityAction();
    const click = a.action === "Focus.open"
      ? "if(window.Focus)Focus.open(nextLessonId(),'dashboard')"
      : `ForgeWidgets4.go('${a.page}')`;
    return `
<section class="card forge-hero forge4-fade" aria-labelledby="forgeHeroTitle">
  <div>
    <p class="forge4-kicker" id="forgeHeroKicker">${esc(a.kicker)}</p>
    <h2 class="forge-hero__title" id="forgeHeroTitle">${esc(a.title)}</h2>
  </div>
  <div class="forge-hero__meta">
    ${a.meta.map(m => `<span>${esc(m)}</span>`).join("")}
    <span class="progress-track" role="progressbar" aria-label="Progresso geral das aulas" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${a.progress}"><i style="width:${a.progress}%"></i></span>
    <span class="small muted">${a.progress}%</span>
  </div>
  <div class="forge-hero__actions">
    <button type="button" class="btn-primary" onclick="${click}">▶ ${esc(a.label)}</button>
    <button type="button" class="secondary" onclick="ForgeWidgets4.go('tracks')">Ver trilhas</button>
  </div>
</section>`;
  }

  /* ---------- 2. Radar SM-2: efator, estabilidade e atraso ---------- */

  function sm2RadarHTML() {
    const s = state();
    const all = Object.entries(s.cards && typeof s.cards === "object" ? s.cards : {});
    const byId = new Map(lessonList().map(l => [l.id, l]));
    const now = Date.now();
    const tracks = new Map();
    all.forEach(([id, card]) => {
      const track = byId.get(id)?.track || "geral";
      const bucket = tracks.get(track) || { ef: [], interval: [], due: 0, total: 0 };
      bucket.ef.push(num(card?.efactor, 2.5));
      bucket.interval.push(num(card?.interval, 0));
      if (num(card?.next_review, 0) && num(card?.next_review, 0) <= now) bucket.due++;
      bucket.total++;
      tracks.set(track, bucket);
    });

    const names = {
      math: "Matemática", c: "C / sistemas", arch: "Arquitetura", assembly: "Assembly",
      ai: "Inteligência artificial", linux: "Linux", software: "Eng. software",
      systems: "Sistemas", networks: "Redes", databases: "Banco de dados",
      security: "Segurança", geral: "Geral"
    };
    const rows = [...tracks.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 6).map(([key, b]) => {
      const avg = arr => arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : 0;
      const ef = avg(b.ef);
      const interval = avg(b.interval);
      const zone = b.due > 0 ? "risk" : (ef < 2.3 || interval < 2 ? "warn" : "safe");
      const zoneLabel = zone === "risk" ? "Revisar" : zone === "warn" ? "Atenção" : "Estável";
      return { key, label: names[key] || key, ef, interval, due: b.due, zone, zoneLabel };
    });

    const bars = rows.length ? rows.map(r => `
      <li class="radar-row">
        <span class="radar-name" title="${esc(r.label)}">${esc(r.label)}</span>
        <span class="radar-fill"><i class="radar-zone-${r.zone}" style="width:${Math.min(100, Math.round((r.ef / 3) * 100))}%"></i></span>
        <span class="radar-value">EF ${r.ef.toFixed(2)} · ${Math.round(r.interval)}d · ${r.due} atrasado</span>
        <span class="radar-tag" data-zone="${r.zone}">${r.zoneLabel}</span>
      </li>`).join("") : `<li class="small muted">Nenhum cartão SM-2 registrado ainda. Conclua uma aula para iniciar o radar.</li>`;

    return `
<section class="card forge4-panel" aria-labelledby="forgeRadarTitle">
  <p class="forge4-kicker">SM-2 · memória espaçada</p>
  <h2 id="forgeRadarTitle" style="margin-top:0">Radar de retenção</h2>
  <p class="small muted">Fator de facilidade, intervalo médio e cartões vencidos por trilha.</p>
  <ul class="radar-list">${bars}</ul>
</section>`;
  }

  /* ---------- 3. Constelação de pré-requisitos (SVG determinístico) ---------- */

  function constellationHTML() {
    const s = state();
    const done = new Set(Array.isArray(s.done) ? s.done : []);
    const all = lessonList();
    const picked = all.filter(l => !done.has(l.id)).slice(0, 5);
    const mastered = all.filter(l => done.has(l.id)).slice(-5);
    const nodes = [...mastered, ...picked].slice(0, 10);
    if (!nodes.length) {
      return `<section class="card forge4-panel constellation" aria-labelledby="forgeGraphTitle">
        <p class="forge4-kicker">Grafo de pré-requisitos</p><h2 id="forgeGraphTitle" style="margin-top:0">Constelação</h2>
        <p class="small muted">O grafo aparece quando o currículo estiver disponível.</p></section>`;
    }

    const positions = nodes.map((lesson, i) => ({
      id: lesson.id,
      title: lesson.title || lesson.id,
      track: lesson.track || "geral",
      done: done.has(lesson.id),
      x: 80 + (i % 5) * 160,
      y: i < 5 ? 105 : 305,
      seed: seedFor(`node|${lesson.id}`)
    }));
    const links = [];
    for (let i = 1; i < positions.length; i++) {
      if (i % 5 !== 0) links.push([positions[i - 1], positions[i]]);
    }
    const linkHTML = links.map(([a, b]) => {
      const ok = a.done && b.done;
      return `<line class="link${ok ? " is-mastered" : ""}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"></line>`;
    }).join("");
    const nodeHTML = positions.map(p => {
      const cls = p.done ? " is-mastered" : "";
      const label = p.title.length > 18 ? p.title.slice(0, 17) + "…" : p.title;
      return `<g role="button" tabindex="0" class="node-group" aria-label="${esc(p.title)}${p.done ? ", concluída" : ", pendente"}"
        onclick="ForgeWidgets4.openLesson('${esc(p.id)}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();ForgeWidgets4.openLesson('${esc(p.id)}')}">
        <circle class="node${cls}" cx="${p.x}" cy="${p.y}" r="26"></circle>
        <text class="node-label" x="${p.x}" y="${p.y + 4}" text-anchor="middle">${esc(label.slice(0, 10))}</text>
        <title>${esc(p.title)} · ${p.done ? "concluída" : "pendente"}</title>
      </g>`;
    }).join("");

    return `
<section class="card forge4-panel constellation" aria-labelledby="forgeGraphTitle">
  <p class="forge4-kicker">Grafo de pré-requisitos</p>
  <h2 id="forgeGraphTitle" style="margin-top:0">Constelação do currículo</h2>
  <p class="small muted">Nós verdes são pré-requisitos concluídos; os demais bloqueiam a próxima etapa.</p>
  <svg viewBox="0 0 800 410" role="group" aria-label="Grafo com ${positions.length} aulas e ${links.length} pré-requisitos">
    <title>Pré-requisitos entre aulas concluídas e pendentes</title>
    <g aria-hidden="true">${linkHTML}</g>${nodeHTML}
  </svg>
</section>`;
  }

  /* ---------- 4. Heatmap 52×7 a partir do dayLog ---------- */

  function addDays(date, days) {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  }

  function heatmapHTML() {
    const s = state();
    const log = s.dayLog && typeof s.dayLog === "object" ? s.dayLog : {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const offset = (today.getDay() + 1) % 7; // domingo = 0
    const start = addDays(today, -(51 * 7 + offset));
    const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const cells = [];
    let active = 0;
    let hours = 0;
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        const d = addDays(start, week * 7 + day);
        const h = num(log[key(d)], 0);
        const future = d > today;
        const level = future ? 0 : (h <= 0 ? 0 : h < 0.5 ? 1 : h < 1.5 ? 2 : h < 3 ? 3 : 4);
        if (h > 0 && !future) { active++; hours += h; }
        cells.push(`<rect class="cell" x="${week * 14}" y="${day * 14}" width="12" height="12" rx="2" data-level="${level}" opacity="${future ? 0.25 : 1}"><title>${key(d)}: ${h.toFixed(1)}h</title></rect>`);
      }
    }
    return `
<section class="card forge4-panel heatmap" aria-labelledby="forgeHeatTitle">
  <p class="forge4-kicker">52 semanas · constância</p>
  <h2 id="forgeHeatTitle" style="margin-top:0">Mapa de calor de estudo</h2>
  <p class="small muted">${active} dias ativos · ${hours.toFixed(1)}h no período.</p>
  <svg viewBox="0 0 728 98" role="img" aria-label="Mapa de calor com ${active} dias de estudo nos últimos 52 semanas">${cells.join("")}</svg>
  <p class="small muted" aria-hidden="true">menos <span class="radar-tag">▢</span> <span class="radar-tag" data-zone="safe">■</span> mais</p>
</section>`;
  }

  /* ---------- 5. Caça-bugs diário com autópsia ---------- */

  const BUGS = [
    {
      title: "Soma de inteiros sem sinal",
      lines: ["uint32_t total = 0;", "for (size_t i = 0; i < n; i++) {", "  total += values[i];", "}", "return total;"],
      fault: 3,
      why: "O somatório pode envolpar em uint32_t antes da conversão. Acumule em uint64_t e valide o limite.",
      category: "Overflow"
    },
    {
      title: "Cópia sem limite",
      lines: ["char dest[16];", "strcpy(dest, entrada);", "return strlen(dest);"],
      fault: 2,
      why: "strcpy não conhece a capacidade de dest. Use snprintf ou strncpy com terminação explícita.",
      category: "Memória"
    },
    {
      title: "Comparação de ponto flutuante",
      lines: ["double a = 0.1 + 0.2;", "double b = 0.3;", "if (a == b) return IGUAL;", "return DIFERENTE;"],
      fault: 3,
      why: "0.1 e 0.2 não são exatos em binary64. Compare com tolerância: fabs(a-b) < 1e-9.",
      category: "Precisão"
    },
    {
      title: "Ponteiro após liberação",
      lines: ["no *p = criar();", "free(p);", "if (p->prox) processar(p);", "return 0;"],
      fault: 3,
      why: "O ponteiro continua apontando para memória reutilizável. Atribua NULL após free.",
      category: "Uso após free"
    },
    {
      title: "Índice negativo silencioso",
      lines: ["int idx = tamanho - 1;", "if (idx >= 0) {", "  return vetor[idx];", "}", "return -1;"],
      fault: 3,
      why: "A conversão implícita de idx negativo para size_t o torna enorme. Cheque o tipo antes de indexar.",
      category: "Conversão"
    },
    {
      title: "Chave de cache sem contexto",
      lines: ["chave = usuario;", "valor = calcular(usuario, periodo);", "cache[chave] = valor;", "return cache[chave];"],
      fault: 1,
      why: "A chave ignora o período: um resultado antigo reaparece. Inclua todas as dimensões da entrada.",
      category: "Estado"
    }
  ];

  function dailyBug() {
    const day = todayISO();
    const index = next(seedFor(`bug|${day}`)) % BUGS.length;
    return { ...BUGS[index], index, day };
  }

  /* ---------- FORGE 7.0: caça-bugs em quatro categorias ---------- */

  const FORGE7_GROUPS = [
    { key: "memoria", label: "Memória C", hint: "UAF, estouro de buffer e vazamento." },
    { key: "assembly", label: "Assembly", hint: "Flags, divisão e pilha desbalanceada." },
    { key: "rede", label: "TCP/IP", hint: "Checksum, ordem de bytes e offset." },
    { key: "cripto", label: "Cripto", hint: "Viés de módulo, nonce e comparação de tag." }
  ];

  const FORGE7_BUGS = [
    {
      id: "uaf", category: "memoria", title: "Ponteiro usado após free",
      lines: ["no *p = criar_no();", "free(p);", "if (p->prox != NULL) processar(p->prox);", "return 0;"],
      fault: 3,
      identify: [
        "A liberação acontece na linha 2 e a leitura na linha 3.",
        "Depois de free o ponteiro guarda o mesmo endereço, mas o bloco pode ter sido reutilizado."
      ],
      fix: [
        "Copie p->prox para uma variável local antes de free.",
        "Anule o ponteiro (p = NULL) após a liberação para transformar o erro em falha explícita."
      ],
      autopsy: [
        "1. free(p) devolve o bloco ao alocador.",
        "2. A linha 3 dereferencia p: comportamento indefinido (use-after-free).",
        "3. Uma alocação posterior pode reapropiar o bloco e alterar p->prox.",
        "4. Copiar o dado antes de free e anular o ponteiro elimina a leitura inválida."
      ],
      why: "UAF é silencioso: o programa pode parecer correto até que o alocador reutilize a memória."
    },
    {
      id: "overflow", category: "memoria", title: "Cópia sem limite para buffer fixo",
      lines: ["char nome[16];", "strcpy(nome, entrada_do_usuario);", "printf(\"%s\\n\", nome);"],
      fault: 2,
      identify: [
        "strcpy não recebe a capacidade de nome: grava até o caractere nulo da entrada.",
        "Com mais de 15 caracteres, os bytes excedentes invadem a memória vizinha."
      ],
      fix: [
        "Use snprintf(nome, sizeof nome, \"%s\", entrada_do_usuario).",
        "Se a entrada vier de arquivo, prefira fgets com sizeof nome e remova a quebra de linha."
      ],
      autopsy: [
        "1. nome tem 16 bytes, então os índices válidos vão de 0 a 15.",
        "2. strcpy escreve 16 + N bytes quando a entrada é longa.",
        "3. O caractere nulo pode sobrescrever variáveis locais e até o endereço de retorno.",
        "4. snprintf respeita sizeof nome e garante terminação da string."
      ],
      why: "Estouro de buffer em stack é uma das vias clássicas de comprometimento de processo."
    },
    {
      id: "leak", category: "memoria", title: "Vazamento no caminho de erro",
      lines: ["buf = malloc(1024);", "if (!carregar_config(buf)) return -1;", "processar(buf);", "free(buf);"],
      fault: 2,
      identify: [
        "O retorno antecipado da linha 2 nunca alcança o free da linha 4.",
        "Todo caminho de saída deve liberar exatamente o que alocou."
      ],
      fix: [
        "Libere antes de retornar: if (!carregar_config(buf)) { free(buf); return -1; }.",
        "Ou centralize a saída em um rótulo cleanup com um único free no final."
      ],
      autopsy: [
        "1. malloc reserva 1024 bytes.",
        "2. carregar_config falha e return -1 pula o free.",
        "3. Cada falha repete o vazamento; em um serviço a memória cresce sem limite.",
        "4. Um único ponto de liberação cobre todos os caminhos de erro."
      ],
      why: "Vazamento não quebra o programa imediatamente: ele aparece como consumo crescente."
    },
    {
      id: "flags", category: "assembly", title: "Flags destruídas antes do salto",
      lines: ["cmp rax, rbx", "add rcx, 1", "je igual"],
      fault: 2,
      identify: [
        "add entre cmp e je recalcula ZF.",
        "O je passa a testar o resultado do add, não a comparação original."
      ],
      fix: [
        "Reordene: cmp rax, rbx; je igual; add rcx, 1.",
        "Se o código entre cmp e salto precisar alterar flags, use pushfq/popfq."
      ],
      autopsy: [
        "1. cmp rax, rbx define ZF=1 quando os valores são iguais.",
        "2. add rcx, 1 substitui ZF pelo resultado do acréscimo.",
        "3. je agora desvia com base em uma condição que não existe mais.",
        "4. Manter cmp e je adjacentes preserva a semântica da comparação."
      ],
      why: "Em x86, quase toda operação aritmética sobrescreve as flags de condição."
    },
    {
      id: "divzero", category: "assembly", title: "Divisão sem validar o divisor",
      lines: ["mov rax, [total]", "mov rcx, [contador]", "div rcx"],
      fault: 3,
      identify: [
        "div rcx divide rdx:rax por rcx e falha se contador for zero.",
        "Não há teste de contador maior que zero antes da instrução."
      ],
      fix: [
        "Insira test rcx, rcx / jz tratamento_erro antes do div.",
        "Prepare rdx com cqo quando o dividendo for sinalizado."
      ],
      autopsy: [
        "1. O dividendo é o par rdx:rax.",
        "2. Com contador igual a zero, a CPU levanta a exceção #DE.",
        "3. Sem tratador, o sistema normalmente encerra o processo.",
        "4. Validar o divisor antes permite um caminho de erro controlado."
      ],
      why: "Divisão por zero em assembly é uma exceção de CPU, não um valor especial."
    },
    {
      id: "stack", category: "assembly", title: "Pilha desbalanceada na chamada",
      lines: ["push rbx", "call processar", "ret"],
      fault: 3,
      identify: [
        "push rbx não tem pop rbx correspondente.",
        "call empurra o endereço de retorno; ret consome esse endereço, deixando rbx na pilha."
      ],
      fix: [
        "Adicione pop rbx entre call e ret.",
        "Respeite a convenção de chamada: registradores preservados voltam ao valor original."
      ],
      autopsy: [
        "1. push rbx salva o registrador no topo da pilha.",
        "2. call empurra o endereço de retorno por cima dele.",
        "3. ret consome somente o endereço; rbx continua empilhado.",
        "4. O chamador encontra a pilha desalinhada; pop rbx restaura o equilíbrio."
      ],
      why: "Desequilíbrio de pilha costuma aparecer como falha no chamador, não na função defeituosa."
    },
    {
      id: "checksum", category: "rede", title: "Checksum IPv4 nunca gravado",
      lines: ["cabecalho->checksum = 0;", "soma = soma16(cabecalho, 20);", "enviar(cabecalho);"],
      fault: 3,
      identify: [
        "O checksum é calculado, mas o resultado não é escrito de volta no cabeçalho.",
        "O pacote sai com o campo zerado e será descartado no destino."
      ],
      fix: [
        "Atribua cabecalho->checksum = soma antes de enviar.",
        "Some em 16 bits com carry end-around e aplique o complemento de 1."
      ],
      autopsy: [
        "1. O campo é zerado para que o cálculo não se inclua.",
        "2. soma16 produz o valor correto.",
        "3. Como não há atribuição, o receptor soma o cabeçalho e não obtém 0xFFFF.",
        "4. Gravar o resultado e converter para ordem de rede com htons corrige o envio."
      ],
      why: "O checksum IPv4 cobre apenas o cabeçalho; o payload é protegido por TCP/UDP."
    },
    {
      id: "endian", category: "rede", title: "Porta TCP lida na ordem errada",
      lines: ["uint16_t total = ip->tot_len;", "uint16_t porta = tcp->src_port;", "printf(\"%u -> %u\\n\", porta, total);"],
      fault: 2,
      identify: [
        "Campos de rede são big-endian; em x86 a leitura direta troca os bytes.",
        "A porta 8080 (0x1F90) aparece como 0x901F (36895)."
      ],
      fix: [
        "Use ntohs(tcp->src_port) e ntohs(ip->tot_len).",
        "Para gravar cabeçalhos, use htons/htonl; para 32 bits de entrada, ntohl."
      ],
      autopsy: [
        "1. O fio carrega os bytes na ordem de rede.",
        "2. A CPU little-endian interpreta o par de bytes invertido.",
        "3. Filtros e logs passam a usar uma porta inexistente.",
        "4. ntohs converte para a ordem do host antes de qualquer comparação."
      ],
      why: "Endianness é um defeito frequente em capturas e em parsing manual de pacotes."
    },
    {
      id: "dataoffset", category: "rede", title: "Offset TCP tratado como bytes",
      lines: ["uint8_t cab = tcp->data_offset;", "payload = pacote + 20 + cab;"],
      fault: 2,
      identify: [
        "O campo data offset conta palavras de 32 bits, não bytes.",
        "Falta isolar os 4 bits e multiplicar por 4."
      ],
      fix: [
        "Calcule (tcp->data_offset & 0xF0) >> 4 e multiplique por 4.",
        "Some ao tamanho do cabeçalho IP, que também vem de (ihl & 0x0F) * 4."
      ],
      autopsy: [
        "1. O data offset ocupa os 4 bits altos do byte 12 do cabeçalho TCP.",
        "2. Valor 5 significa 5 * 4 = 20 bytes de cabeçalho.",
        "3. Somar 5 faz o payload começar no meio do cabeçalho.",
        "4. Isolar os bits e multiplicar por 4 aponta para o início real dos dados."
      ],
      why: "Opções TCP aumentam o cabeçalho, então o offset nunca deve ser fixo em 20."
    },
    {
      id: "modulo", category: "cripto", title: "Viés de módulo no sorteio",
      lines: ["uint32_t x = csprng();", "int dado = (x % 6) + 1;"],
      fault: 2,
      identify: [
        "2^32 não é múltiplo de 6, logo alguns restos aparecem uma vez a mais.",
        "O viés é pequeno por amostra, mas mensurável em muitos sorteios."
      ],
      fix: [
        "Use rejeição: limite = 2^32 - (2^32 % 6) e descarte x maior ou igual ao limite.",
        "Em alternativa, use bits com rejeição e descarte os valores acima do último bloco completo."
      ],
      autopsy: [
        "1. csprng() é uniforme em [0, 2^32).",
        "2. 2^32 = 6 * 715827882 + 4, então quatro restos ganham um valor extra.",
        "3. Os dados 1 a 4 ficam marginalmente mais prováveis que 5 e 6.",
        "4. Descartar os quatro valores excedentes antes do módulo restaura a uniformidade."
      ],
      why: "A fonte pode ser perfeita e ainda assim o módulo introduzir viés."
    },
    {
      id: "nonce", category: "cripto", title: "Nonce repetido sob a mesma chave",
      lines: ["nonce = \"fixo-para-todos\";", "tag = aes_gcm_encrypt(chave, nonce, msg, &ct);"],
      fault: 1,
      identify: [
        "O nonce é constante, mas AEAD exige unicidade por chave.",
        "Com o mesmo nonce, o XOR dos ciphertexts revela o XOR dos plaintexts."
      ],
      fix: [
        "Gere 96 bits aleatórios por mensagem com um CSPRNG.",
        "Envie o nonce junto do ciphertext: ele não é secreto, mas nunca pode repetir sob a mesma chave."
      ],
      autopsy: [
        "1. AES-GCM deriva o keystream daquela mensagem a partir do nonce.",
        "2. Repetir nonce gera o mesmo keystream para duas mensagens.",
        "3. C1 xor C2 = P1 xor P2, e a tag perde a garantia de originalidade.",
        "4. Nonce aleatório ou contador por chave elimina a colisão."
      ],
      why: "Nonce é público e único; chave é secreta e reutilizável. Trocar os papéis é fatal."
    },
    {
      id: "tagcmp", category: "cripto", title: "Tag autenticada comparada com memcmp",
      lines: ["if (memcmp(tag_recebido, tag_calculado, 16) == 0) Aceitar();"],
      fault: 1,
      identify: [
        "memcmp costuma parar no primeiro byte diferente.",
        "O tempo de resposta revela quantos bytes iniciais o atacante acertou."
      ],
      fix: [
        "Use uma comparação em tempo constante, como CRYPTO_memcmp.",
        "Percorra sempre os 16 bytes acumulando diferenças com XOR, sem retorno antecipado."
      ],
      autopsy: [
        "1. O atacante envia tags candidatas e mede o tempo até a resposta.",
        "2. O retorno cedo de memcmp vaza o prefixo correto byte a byte.",
        "3. Com poucas centenas de tentativas por posição, a tag é recuperada.",
        "4. Comparação em tempo constante fecha esse canal lateral."
      ],
      why: "Canais laterais de tempo transformam comparações 'corretas' em oráculos."
    }
  ];

  const forge7State = { category: "", caseId: "", day: "", revealed: {} };
  const forge7StepLabels = {
    identify: { off: "1. Identificar a linha", on: "1. Linha identificada" },
    fix: { off: "2. Ver a correção", on: "2. Correção revelada" },
    autopsy: { off: "3. Abrir autópsia", on: "3. Autópsia completa" }
  };

  function forge7DailyBug() {
    const day = todayISO();
    const group = FORGE7_GROUPS[next(seedFor(`bug7cat|${day}`)) % FORGE7_GROUPS.length];
    const pool = FORGE7_BUGS.filter(b => b.category === group.key);
    const bug = pool[next(seedFor(`bug7case|${day}`)) % pool.length];
    return { ...bug, day, categoryLabel: group.label };
  }

  function resetForge7Reveals() {
    forge7State.revealed = { identify: false, fix: false, autopsy: false };
  }

  function ensureForge7Selection() {
    if (forge7State.caseId && FORGE7_BUGS.some(b =>
      b.id === forge7State.caseId && b.category === forge7State.category)) return;
    const daily = forge7DailyBug();
    forge7State.category = daily.category;
    forge7State.caseId = daily.id;
    forge7State.day = daily.day;
    resetForge7Reveals();
  }

  function currentForge7Bug() {
    ensureForge7Selection();
    return FORGE7_BUGS.find(b => b.id === forge7State.caseId) || FORGE7_BUGS[0];
  }

  function forge7StepsHTML(items) {
    return `<ol class="small">${(items || []).map(item => `<li>${esc(item)}</li>`).join("")}</ol>`;
  }

  function forge7BugHuntHTML() {
    ensureForge7Selection();
    const bug = currentForge7Bug();
    const group = FORGE7_GROUPS.find(g => g.key === forge7State.category) || FORGE7_GROUPS[0];
    const tabs = FORGE7_GROUPS.map(g => `
      <button type="button" id="forge7Tab-${esc(g.key)}" class="${g.key === forge7State.category ? "" : "secondary"}"
        style="min-height:48px" aria-pressed="${g.key === forge7State.category}" title="${esc(g.hint)}"
        onclick="ForgeWidgets4.selectBugCategory('${esc(g.key)}')">${esc(g.label)}</button>`).join("");
    const cases = FORGE7_BUGS.filter(b => b.category === forge7State.category);
    const options = cases.map(b => `<option value="${esc(b.id)}" ${b.id === bug.id ? "selected" : ""}>${esc(b.title)}</option>`).join("");
    const lines = bug.lines.map((line, i) => {
      const marked = forge7State.revealed.identify && (i + 1) === bug.fault;
      return `<li${marked ? ' data-line="fault"' : ""}><code>${esc(line)}</code>${marked ? " <b class=\"small\">← defeito</b>" : ""}</li>`;
    }).join("");
    const step = (key, title, content) => `
      <div id="forge7Step-${key}" ${forge7State.revealed[key] ? "" : 'hidden style="display:none"'}>
        <h4>${esc(title)}</h4>${content}
      </div>`;
    const button = key => `
      <button type="button" id="forge7Btn-${key}" style="min-height:48px" aria-expanded="${Boolean(forge7State.revealed[key])}"
        aria-controls="forge7Step-${key}" ${forge7State.revealed[key] ? "disabled" : ""}
        onclick="ForgeWidgets4.revealBugStep('${key}')">${esc(forge7State.revealed[key] ? forge7StepLabels[key].on : forge7StepLabels[key].off)}</button>`;
    return `
<section class="card forge4-panel" id="forge7BugLab" aria-labelledby="forge7BugLabTitle">
  <p class="forge4-kicker">FORGE 7.0 · quatro categorias</p>
  <h2 id="forge7BugLabTitle" style="margin-top:0">Laboratório de defeitos reais</h2>
  <p class="small muted">Caso do dia: ${esc(forge7State.day)} · ${esc(group.label)}. Identifique a linha, aplique a correção e só depois abra a autópsia.</p>
  <div class="actions" role="group" aria-label="Categorias de defeitos">${tabs}</div>
  <label for="forge7CaseSelect" class="small muted" style="display:block;margin-top:12px">Caso</label>
  <select class="field" id="forge7CaseSelect" style="min-height:48px" onchange="ForgeWidgets4.selectBugCase(this.value)">${options}</select>
  <div id="forge7BugCasePanel" style="margin-top:12px">
    <h3>${esc(bug.title)}</h3>
    <ol class="bug-autopsy">${lines}</ol>
    <div class="actions">${button("identify")}${button("fix")}${button("autopsy")}</div>
    ${step("identify", "1. Identificação", forge7StepsHTML(bug.identify))}
    ${step("fix", "2. Correção", forge7StepsHTML(bug.fix))}
    ${step("autopsy", "3. Autópsia resolvida (passo a passo)", forge7StepsHTML(bug.autopsy) + `<p class="small muted">${esc(bug.why)}</p>`)}
  </div>
</section>`;
  }

  function refreshForge7Lab() {
    if (typeof document === "undefined" || !document.getElementById) return;
    const holder = document.getElementById("forge7BugLab");
    if (!holder) return;
    const active = document.activeElement;
    const activeId = active && active.id ? active.id : "";
    holder.outerHTML = forge7BugHuntHTML();
    const again = activeId ? document.getElementById(activeId) : null;
    if (again && typeof again.focus === "function") again.focus();
  }

  function selectBugCategory(key) {
    if (!FORGE7_GROUPS.some(g => g.key === key)) return false;
    forge7State.category = key;
    const first = FORGE7_BUGS.find(b => b.category === key);
    forge7State.caseId = first ? first.id : "";
    resetForge7Reveals();
    refreshForge7Lab();
    return true;
  }

  function selectBugCase(id) {
    const bug = FORGE7_BUGS.find(b => b.id === id && b.category === forge7State.category);
    if (!bug) return false;
    forge7State.caseId = bug.id;
    resetForge7Reveals();
    refreshForge7Lab();
    return true;
  }

  function revealBugStep(key) {
    if (!Object.prototype.hasOwnProperty.call(forge7StepLabels, key)) return false;
    forge7State.revealed[key] = true;
    if (typeof document === "undefined") return true;
    const panel = document.getElementById("forge7Step-" + key);
    if (panel) { panel.hidden = false; panel.style.display = ""; }
    const btn = document.getElementById("forge7Btn-" + key);
    if (btn) {
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = forge7StepLabels[key].on;
      btn.disabled = true;
    }
    return true;
  }

  function bugHuntHTML() {
    const bug = dailyBug();
    const history = Array.isArray(state().bug_hunt_history) ? state().bug_hunt_history : [];
    const doneToday = history.some(h => String(h.day || h.at || "").slice(0, 10) === bug.day);
    const lines = bug.lines.map((line, i) => `
      <label class="bug-line"><input type="radio" name="bugLine" value="${i + 1}"> <span class="small muted">${String(i + 1).padStart(2, "0")}</span> <code>${esc(line)}</code></label>`).join("");
    return `
<section class="card forge4-panel" id="bugHuntCard" aria-labelledby="bugHuntTitle">
  <p class="forge4-kicker">Caça-bugs · ${esc(bug.day)} · ${esc(bug.category)}</p>
  <h2 id="bugHuntTitle" style="margin-top:0">${esc(bug.title)}</h2>
  <p class="small muted">${doneToday ? "Caso de hoje já registrado. Você pode repetir a autópsia." : "Qual linha contém a falha? Justifique antes de revelar a resposta."}</p>
  <form class="bug-artifact" onsubmit="event.preventDefault();ForgeWidgets4.submitBug()">
    <fieldset style="border:0;padding:0;margin:0">${lines}</fieldset>
    <label for="bugJustify" class="small muted">Hipótese (mínimo 20 caracteres)</label>
    <textarea id="bugJustify" class="oral-answer" minlength="20" style="min-height:80px"></textarea>
    <div class="actions" style="margin-top:10px">
      <button type="submit">Registrar diagnóstico</button>
      <button type="button" class="secondary" onclick="ForgeWidgets4.toggleAutopsy()">Modo autópsia</button>
    </div>
  </form>
  <div id="bugAutopsy" class="bug-autopsy" hidden></div>
</section>
${forge7BugHuntHTML()}`;
  }

  function submitBug() {
    const bug = dailyBug();
    const checked = (typeof document !== "undefined" && document.querySelector) ? document.querySelector('input[name="bugLine"]:checked') : null;
    const justify = typeof document !== "undefined" ? document.getElementById("bugJustify")?.value || "" : "";
    const chosen = checked ? Number(checked.value) : 0;
    if (!chosen || String(justify).trim().length < 20) {
      if (typeof toast === "function") toast("Selecione uma linha e escreva ao menos 20 caracteres.");
      return null;
    }
    const correct = chosen === bug.fault;
    if (typeof Storage !== "undefined" && typeof Storage.recordBugHunt === "function") {
      Storage.recordBugHunt({ day: bug.day, case: bug.title, line: chosen, correct, justify: String(justify).slice(0, 500) });
    }
    revealAutopsy(bug, correct, justify);
    if (typeof toast === "function") toast(correct ? "Diagnóstico correto. Autópsia liberada." : "Diagnóstico incorreto. Estude a autópsia.");
    return { correct, line: chosen, fault: bug.fault };
  }

  function revealAutopsy(bug, correct, justify) {
    const el = typeof document !== "undefined" ? document.getElementById("bugAutopsy") : null;
    if (!el) return;
    const lines = bug.lines.map((line, i) => `<div${i + 1 === bug.fault ? ' data-line="fault"' : ""}><code>${String(i + 1).padStart(2, "0")} ${esc(line)}</code></div>`).join("");
    el.innerHTML = `<h3>Autópsia · ${correct ? "acertou a linha" : "linha correta: " + bug.fault}</h3>
      <p>${esc(bug.why)}</p><div class="bug-autopsy">${lines}</div>
      <p class="small muted">Sua hipótese: ${esc(justify).slice(0, 300)}</p>`;
    el.hidden = false;
  }

  function toggleAutopsy() {
    const el = typeof document !== "undefined" ? document.getElementById("bugAutopsy") : null;
    if (!el) return;
    if (!el.innerHTML) revealAutopsy(dailyBug(), false, "Autópsia solicitada sem diagnóstico prévio.");
    else el.hidden = !el.hidden;
  }

  /* ---------- Montagem idempotente ---------- */

  function mount(v) {
    if (!v || typeof v.insertAdjacentHTML !== "function") return null;
    if (typeof v.querySelector === "function") v.querySelector("#forge4Widgets")?.remove();
    const html = `
<section id="forge4Widgets" class="forge4-grid forge4-grid--wide" aria-label="Painel de comando FORGE 7.0" style="margin-top:16px">
  ${heroHTML()}
  <div class="forge4-grid">
    ${sm2RadarHTML()}
    ${constellationHTML()}
  </div>
  ${heatmapHTML()}
  ${bugHuntHTML()}
</section>`;
    v.insertAdjacentHTML("beforeend", html);
    return html;
  }

  function openLesson(id) {
    if (typeof window === "undefined") return;
    window.currentLesson = null;
    if (typeof window.openLesson === "function") { window.openLesson(id); return; }
    const found = lessonList().find(l => l.id === id);
    if (found && typeof window.openTrack === "function") window.openTrack(found.track);
    else go("tracks");
  }

  const api = {
    mount, go, heroHTML, sm2RadarHTML, constellationHTML, heatmapHTML, bugHuntHTML,
    priorityAction, dailyBug, submitBug, toggleAutopsy, openLesson,
    /* FORGE 7.0 — API aditiva; as funções acima permanecem inalteradas. */
    FORGE7_GROUPS, FORGE7_BUGS,
    forge7BugHuntHTML, forge7DailyBug, currentForge7Bug,
    selectBugCategory, selectBugCase, revealBugStep,
    state: { get seed() { return userSeed(); } }
  };
  if (typeof window !== "undefined") window.ForgeWidgets4 = api;
})();

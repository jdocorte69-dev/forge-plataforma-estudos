/* ============================================================
   FORGE — labs-extra.js
   Laboratórios adicionais: redes (subnetting, DNS, pacotes)
   e banco de dados (SQL simulado). Expõe window.ExtraLabs.
   ============================================================ */

(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---------------------- Redes: sub-redes ------------------- */

  function ipToInt(ip) {
    const p = String(ip).trim().split(".");
    if (p.length !== 4) return null;
    const n = p.map(x => Number(x));
    if (n.some(x => !Number.isInteger(x) || x < 0 || x > 255)) return null;
    return (((n[0] * 256 + n[1]) * 256 + n[2]) * 256 + n[3]) >>> 0;
  }

  function intToIp(n) {
    n = n >>> 0;
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  }

  function maskFromPrefix(prefix) {
    return prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
  }

  function prefixFromMask(mask) {
    const m = String(mask).trim();
    if (/^\d{1,2}$/.test(m)) {
      const n = Number(m);
      return n >= 0 && n <= 32 ? n : null;
    }
    const v = ipToInt(m);
    if (v === null) return null;
    let bits = 0, x = v;
    while ((x & 0x80000000) !== 0) { bits++; x = (x << 1) >>> 0; }
    return /^1{0,32}0*$/.test(m.split(".").map(o => Number(o).toString(2).padStart(8, "0")).join("")) ? bits : null;
  }

  function subnetInfo(ip, prefix, count) {
    const base = ipToInt(ip);
    const p = prefixFromMask(prefix);
    if (base === null || p === null) return { error: "IP ou máscara inválidos. Use IPv4 e prefixo 0–32." };
    const mask = maskFromPrefix(p);
    const network = (base & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const total = Math.pow(2, 32 - p);
    const usable = p <= 30 ? Math.max(0, total - 2) : (p === 31 ? 2 : 1);
    const out = {
      ip: intToIp(base), prefix: p, mask: intToIp(mask),
      network: intToIp(network), broadcast: intToIp(broadcast),
      total, usable,
      first: p <= 30 ? intToIp((network + 1) >>> 0) : intToIp(network),
      last: p <= 30 ? intToIp((broadcast - 1) >>> 0) : intToIp(broadcast)
    };

    const n = Number(count);
    if (Number.isInteger(n) && n >= 2 && n <= 1024) {
      const bits = Math.ceil(Math.log2(n));
      const np = p + bits;
      if (np > 30) {
        out.splitError = "Prefixo resultante /" + np + " deixa menos de 2 hosts por sub-rede. Escolha menos sub-redes.";
      } else {
        const size = Math.pow(2, 32 - np);
        out.newPrefix = np;
        out.newMask = intToIp(maskFromPrefix(np));
        out.perSubnet = Math.max(0, size - 2);
        out.subnets = [];
        for (let i = 0; i < Math.min(n, 8); i++) {
          const net = (network + i * size) >>> 0;
          const bc = (net + size - 1) >>> 0;
          out.subnets.push({
            n: i + 1,
            network: intToIp(net),
            first: intToIp((net + 1) >>> 0),
            last: intToIp((bc - 1) >>> 0),
            broadcast: intToIp(bc)
          });
        }
        out.hidden = Math.max(0, n - out.subnets.length);
      }
    }
    return out;
  }

  function runSubnet() {
    const ip = document.getElementById("subIp")?.value || "192.168.10.0";
    const prefix = document.getElementById("subPrefix")?.value || "24";
    const count = document.getElementById("subCount")?.value || "4";
    const r = subnetInfo(ip, prefix, count);
    const box = document.getElementById("subResult");
    if (!box) return;
    if (r.error) { box.innerHTML = '<p class="bad">' + esc(r.error) + "</p>"; return; }

    box.innerHTML = `
<div class="grid2">
  <div><span class="small muted">Endereço digitado</span><br><b>${esc(r.ip)}</b></div>
  <div><span class="small muted">Máscara</span><br><b>${esc(r.mask)} (/${r.prefix})</b></div>
  <div><span class="small muted">Rede</span><br><b>${esc(r.network)}</b></div>
  <div><span class="small muted">Broadcast</span><br><b>${esc(r.broadcast)}</b></div>
  <div><span class="small muted">Primeiro host</span><br><b>${esc(r.first)}</b></div>
  <div><span class="small muted">Último host</span><br><b>${esc(r.last)}</b></div>
  <div><span class="small muted">Endereços na rede</span><br><b>${r.total.toLocaleString("pt-BR")}</b></div>
  <div><span class="small muted">Hosts utilizáveis</span><br><b>${r.usable.toLocaleString("pt-BR")}</b></div>
</div>
${r.splitError ? '<p class="bad small">' + esc(r.splitError) + "</p>" : ""}
${r.newPrefix !== undefined ? `<h3>Divisão em ${esc(count)} sub-redes</h3>
<p>Pegue ${Math.ceil(Math.log2(Number(count)))} bits emprestados: prefixo <b>/${r.newPrefix}</b>, máscara <b>${esc(r.newMask)}</b>, <b>${r.perSubnet.toLocaleString("pt-BR")}</b> hosts por sub-rede.</p>
<div class="table-wrap"><table><thead><tr><th>#</th><th>Rede</th><th>Primeiro host</th><th>Último host</th><th>Broadcast</th></tr></thead><tbody>
${r.subnets.map(s => `<tr><td>${s.n}</td><td>${esc(s.network)}</td><td>${esc(s.first)}</td><td>${esc(s.last)}</td><td>${esc(s.broadcast)}</td></tr>`).join("")}
</tbody></table></div>
${r.hidden ? '<p class="small muted">Mais ' + r.hidden + " sub-redes seguem o mesmo padrão.</p>" : ""}` : ""}
<p class="small muted">Cálculo realizado localmente no navegador. Nenhum pacote é enviado.</p>`;
  }

  /* ------------------------ Redes: DNS ----------------------- */

  function runDns() {
    const domain = (document.getElementById("dnsDomain")?.value || "exemplo.com").trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!/^[a-z0-9.-]+$/i.test(domain) || domain.includes("..")) {
      const box = document.getElementById("dnsResult");
      if (box) box.innerHTML = '<p class="bad">Informe um nome de domínio válido, como exemplo.com.</p>';
      return;
    }
    const parts = domain.split(".").reverse();
    const tld = parts[0];
    const box = document.getElementById("dnsResult");
    if (!box) return;
    box.innerHTML = `
<div class="callout"><b>Simulação didática.</b> Nenhuma consulta DNS real é feita; os passos mostram o fluxo conceitual de uma resolução recursiva.</div>
<ol class="dns-steps">
  <li><b>1. Cliente → resolvedor recursivo</b><br><span class="muted">Pergunta: “qual o endereço de ${esc(domain)}?”</span></li>
  <li><b>2. Resolvedor → servidor raiz</b><br><span class="muted">A raiz não sabe o endereço, mas indica quem administra <b>.${esc(tld)}</b>.</span></li>
  <li><b>3. Resolvedor → servidor TLD (.${esc(tld)})</b><br><span class="muted">O TLD indica o servidor autoritativo do domínio ${esc(domain)}.</span></li>
  <li><b>4. Resolvedor → servidor autoritativo</b><br><span class="muted">Responde com o registro (por exemplo um A/AAAA) e o TTL.</span></li>
  <li><b>5. Resolvedor → cliente</b><br><span class="muted">Guarda a resposta em cache pelo tempo do TTL e devolve o endereço.</span></li>
</ol>
<p class="small muted">Na prática, cache, CNAME, DNSSEC e qualquer estratégia de resolução podem alterar esse caminho. Consulte RFC 1034 e RFC 1035.</p>`;
  }

  /* ---------------------- Redes: pacotes --------------------- */

  const PACKETS = {
    http: {
      name: "Requisição HTTP sobre TCP",
      layers: [
        ["Aplicação", "GET /index.html HTTP/1.1", "Dados da aplicação: método, caminho e cabeçalhos."],
        ["Transporte", "TCP · porta de origem efêmera → destino 80", "Segments com números de sequência, ACK e janela."],
        ["Rede", "IPv4 · origem → destino · TTL", "Packet com endereços de origem e destino."],
        ["Enlace", "Ethernet · MAC de origem → próximo salto", "Frame com endereços MAC da rede local."]
      ]
    },
    dns: {
      name: "Consulta DNS sobre UDP",
      layers: [
        ["Aplicação", "Consulta: exemplo.com tipo A", "Mensagem DNS com identificador e questão."],
        ["Transporte", "UDP · porta 53", "Datagrama sem handshake e sem garantia de entrega."],
        ["Rede", "IPv4 ou IPv6 → resolvedor", "Packet roteado até o resolvedor configurado."],
        ["Enlace", "Ethernet ou Wi-Fi", "Frame até o próximo salto."]
      ]
    },
    icmp: {
      name: "Echo request (ping)",
      layers: [
        ["Aplicação", "ping destino", "Comando do usuário; não há camada de aplicação separada no ICMP."],
        ["Rede", "ICMP tipo 8 (echo request)", "Packet com identificador e sequência."],
        ["Rede", "IPv4 · protocolo 1", "Endereço de destino e TTL decrescente."],
        ["Enlace", "Ethernet", "Frame entregue ao roteador seguinte."]
      ]
    }
  };

  function showPacket() {
    const k = document.getElementById("packetKind")?.value || "http";
    const p = PACKETS[k] || PACKETS.http;
    const box = document.getElementById("packetResult");
    if (!box) return;
    box.innerHTML = `<h3>${esc(p.name)}</h3>
      <div class="packet-stack">${p.layers.map((l, i) => `<div class="packet-layer">
        <span class="packet-index">${i + 1}</span>
        <div><b>${esc(l[0])}</b><p class="small">${esc(l[1])}</p><p class="small muted">${esc(l[2])}</p></div>
      </div>`).join("")}</div>
      <p class="small muted">Diagrama conceitual: cada camada encapsula a anterior. Use Wireshark em um laboratório real para observar bytes e cabeçalhos.</p>`;
  }

  /* --------------------- Banco de dados ---------------------- */

  const ALUNOS = [
    { id: 1, nome: "Ana", cidade: "Recife", curso: "C", nota: 9.1 },
    { id: 2, nome: "Bruno", cidade: "São Paulo", curso: "Redes", nota: 7.4 },
    { id: 3, nome: "Carla", cidade: "Recife", curso: "C", nota: 8.2 },
    { id: 4, nome: "Diego", cidade: "Belo Horizonte", curso: "Dados", nota: 5.8 },
    { id: 5, nome: "Elisa", cidade: "São Paulo", curso: "Dados", nota: 8.8 },
    { id: 6, nome: "Fausto", cidade: "Recife", curso: "Redes", nota: 6.9 }
  ];

  const QUERIES = {
    q1: {
      sql: "SELECT nome, cidade FROM alunos WHERE cidade = 'Recife';",
      run: () => ALUNOS.filter(a => a.cidade === "Recife").map(a => ({ nome: a.nome, cidade: a.cidade }))
    },
    q2: {
      sql: "SELECT * FROM alunos WHERE nota >= 7 ORDER BY nota DESC;",
      run: () => ALUNOS.filter(a => a.nota >= 7).sort((a, b) => b.nota - a.nota)
    },
    q3: {
      sql: "SELECT curso, COUNT(*) AS total FROM alunos GROUP BY curso ORDER BY total DESC;",
      run: () => {
        const g = {};
        ALUNOS.forEach(a => { g[a.curso] = (g[a.curso] || 0) + 1; });
        return Object.entries(g).map(([curso, total]) => ({ curso, total })).sort((a, b) => b.total - a.total);
      }
    }
  };

  function runSql() {
    const key = document.getElementById("sqlQuery")?.value || "q1";
    const q = QUERIES[key] || QUERIES.q1;
    const rows = q.run();
    const cols = Object.keys(rows[0] || {});
    const box = document.getElementById("sqlResult");
    if (!box) return;
    box.innerHTML = `<div class="callout"><b>Consulta executada (simulação local):</b><br><code>${esc(q.sql)}</code></div>
      <div class="table-wrap"><table><thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(r => `<tr>${cols.map(c => `<td>${esc(r[c])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <p class="small muted">${rows.length} linha${rows.length === 1 ? "" : "s"} retornada${rows.length === 1 ? "" : "s"}. Os dados são fictícios e ficam apenas nesta página.</p>`;
  }

  function checkSql() {
    const sel = document.querySelector('input[name="sqlChallenge"]:checked');
    const fb = document.getElementById("sqlChallengeFb");
    if (!fb || !sel) return;
    const ok = sel.value === "q1";
    fb.textContent = ok
      ? "Correto. WHERE cidade = 'Recife' filtra linhas antes de projetar as colunas."
      : "Ainda não. A cláusula WHERE filtra linhas; tente a consulta que compara cidade = 'Recife'.";
    fb.className = "feedback " + (ok ? "good" : "bad");
    if (ok && typeof Storage !== "undefined" && typeof Storage.toggleLab === "function") {
      Storage.toggleLab("db-sql-basico", true);
    }
  }

  /* --------------- Diagnóstico de rede (simulador) ------------ */

  const DIAG_SCENARIOS = [
    {
      id: "ping-ok-http-fail",
      title: "Ping responde, mas o site não abre",
      symptoms: ["ping -c 3 1.1.1.1 → 0% packet loss", "curl -v https://exemplo.com → Connection refused", "ss -tuln no servidor → porta 443 ausente"],
      options: ["Serviço HTTP/HTTPS não está escutando na porta", "Falha de resolução DNS", "Rota padrão ausente", "Problemas de CRC no enlace"],
      correct: 0,
      explanation: "ICMP (ping) e TCP usam protocolos distintos. Responder ping prova apenas conectividade IP até o host; não prova que a porta 443 aceita conexões. Confira ss -tulnp no servidor e a cadeia TLS depois."
    },
    {
      id: "dns-fail",
      title: "IP direto funciona, nome de domínio falha",
      symptoms: ["curl http://203.0.113.10 → 200 OK", "curl http://exemplo.com → Could not resolve host", "dig exemplo.com → status: SERVFAIL"],
      options: ["Resolução DNS falhando no resolvedor", "Porta TCP bloqueada pelo firewall", "MTU muito baixa na interface", "Peer ARP incompleto"],
      correct: 0,
      explanation: "O endereço IP funciona, então a camada de rede e transporte estão saudáveis. SERVFAIL indica problema na resolução: teste dig @1.1.1.1 exemplo.com e compare com o resolvedor configurado."
    },
    {
      id: "no-route",
      title: "Nenhum pacote sai da máquina",
      symptoms: ["ip route → sem default via", "ping 1.1.1.1 → Network is unreachable", "ip -4 addr →  eth0: 192.168.1.20/24"],
      options: ["Falta rota padrão para redes externas", "DNS autoritativo fora do ar", "Certificado X.509 expirado", "Porta UDP 53 ocupada"],
      correct: 0,
      explanation: "A interface tem IP, mas sem rota padrão o kernel não sabe para onde enviar destinos fora da rede local. Corrija com a rota adequada ao gateway; use ip route get 1.1.1.1 para confirmar."
    },
    {
      id: "tls-chain",
      title: "TCP conecta, navegador avisa certificado inválido",
      symptoms: ["nc -vz exemplo.com 443 → succeeded", "curl -v https://exemplo.com → certificate verify failed", "dig +short exemplo.com → IP correto"],
      options: ["Cadeia de certificados X.509 inválida", "Handshake TCP não concluído", "Endereço MAC duplicado", "TTL expirado no roteador"],
      correct: 0,
      explanation: "A conexão TCP foi estabelecida; a falha está na camada de aplicação/TLS. Inspecione a cadeia com openssl s_client -connect exemplo.com:443 -servername exemplo.com e verifique CA, hostname e validade."
    },
    {
      id: "arp-miss",
      title: "Host da mesma LAN não responde",
      symptoms: ["ping 192.168.1.1 → Destination host unreachable", "ip neigh → 192.168.1.1 INCOMPLETE", "ip route → 192.168.1.0/24 dev eth0"],
      options: ["Resolução ARP sem resposta no enlace", "Servidor DNS externo fora do ar", "Porta TCP 80 em TIME_WAIT", "Prefixo IPv6 incorreto"],
      correct: 0,
      explanation: "Destino está na mesma sub-rede, então o kernel precisa do MAC via ARP. INCOMPLETE indica que não houve resposta. Verifique cabamento/VLAN, firewall do roteador e use tcpdump -nn -i eth0 arp."
    }
  ];

  function diagnosisHTML(scenario) {
    const s = scenario || DIAG_SCENARIOS[0];
    return `<h3>${esc(s.title)}</h3>
      <p class="small muted">Sintomas coletados no terminal:</p>
      <ul class="small">${s.symptoms.map(x => `<li><code>${esc(x)}</code></li>`).join("")}</ul>
      <p class="small"><b>Qual é a causa mais provável?</b></p>
      ${s.options.map((o, i) => `<label class="check"><input type="radio" name="diagOption" value="${i}"> ${esc(o)}</label>`).join("")}
      <div class="actions"><button onclick="ExtraLabs.checkDiagnosis('${s.id}',${s.correct})">Diagnosticar</button></div>
      <div class="feedback" id="diagFb" aria-live="polite"></div>`;
  }

  function renderDiagnosis() {
    const box = document.getElementById("diagResult");
    if (!box) return;
    const id = document.getElementById("diagScenario")?.value || DIAG_SCENARIOS[0].id;
    box.innerHTML = diagnosisHTML(DIAG_SCENARIOS.find(x => x.id === id) || DIAG_SCENARIOS[0]);
  }

  function checkDiagnosis(id, correct) {
    const sel = document.querySelector('input[name="diagOption"]:checked');
    const fb = document.getElementById("diagFb");
    if (!fb) return;
    if (!sel) { fb.textContent = "Selecione uma hipótese antes de diagnosticar."; fb.className = "feedback warn"; return; }
    const ok = Number(sel.value) === Number(correct);
    const s = DIAG_SCENARIOS.find(x => x.id === id) || DIAG_SCENARIOS[0];
    fb.textContent = ok ? `Correto. ${s.explanation}` : `Ainda não. ${s.explanation}`;
    fb.className = "feedback " + (ok ? "good" : "bad");
    if (ok && typeof Storage !== "undefined" && typeof Storage.toggleLab === "function") {
      Storage.toggleLab("net-diagnostico", true);
    }
  }

  const WIRESHARK_LABS = [
    ["wireshark-http", "HTTP", "Requisição/resposta, métodos, códigos e cabeçalhos."],
    ["wireshark-dns", "DNS", "Consulta, resposta, recursão, cache e TTL."],
    ["wireshark-tcp", "TCP", "Handshake SYN/SYN-ACK/ACK, ACKs, retransmissões e FIN."],
    ["wireshark-ip", "IP", "Cabeçalho IPv4, TTL, fragmentação e endereçamento."],
    ["wireshark-arp", "Ethernet/ARP", "Endereços MAC, broadcast e resolução IP → MAC."]
  ];

  /* -------------------------- HTML --------------------------- */

  function networkLab() {
    return `
<div class="grid2">
  <div class="card section">
    <h2>Calculadora de sub-redes IPv4</h2>
    <p class="muted">Informe um endereço, um prefixo e quantas sub-redes iguais você precisa. O cálculo é feito no navegador.</p>
    <div class="plan-form">
      <label>Endereço IPv4<input class="field" id="subIp" value="192.168.10.0" inputmode="numeric"></label>
      <label>Prefixo (0–32)<input class="field" id="subPrefix" value="24" inputmode="numeric"></label>
      <label>Sub-redes desejadas<input class="field" id="subCount" value="4" inputmode="numeric"></label>
    </div>
    <div class="actions"><button onclick="ExtraLabs.runSubnet()">Calcular</button></div>
    <div id="subResult" class="section"></div>
  </div>
  <div class="card section">
    <h2>Resolução DNS, passo a passo</h2>
    <p class="muted">Acompanhe uma consulta recursada desde o cliente até o servidor autoritativo.</p>
    <label for="dnsDomain">Domínio</label>
    <input class="field" id="dnsDomain" value="exemplo.com">
    <div class="actions"><button onclick="ExtraLabs.runDns()">Visualizar fluxo</button></div>
    <div id="dnsResult" class="section"></div>
  </div>
</div>
<div class="card section">
  <h2>Como um pacote é encapsulado</h2>
  <p class="muted">Escolha um cenário para ver as camadas envolvidas.</p>
  <select class="field" id="packetKind" aria-label="Cenário de encapsulamento" onchange="ExtraLabs.showPacket()">
    <option value="http">Requisição HTTP sobre TCP</option>
    <option value="dns">Consulta DNS sobre UDP</option>
    <option value="icmp">Echo request (ping)</option>
  </select>
  <div id="packetResult" class="section"></div>
</div>
<div class="card section">
  <h2>Simulador de diagnóstico de rede</h2>
  <p class="muted">Você recebe a saída de comandos reais (simulados) e deve escolher a causa. O feedback explica qual camada investigar.</p>
  <label for="diagScenario">Cenário</label>
  <select class="field" id="diagScenario" aria-label="Cenário de diagnóstico" onchange="ExtraLabs.renderDiagnosis()">
    ${DIAG_SCENARIOS.map(s => `<option value="${s.id}">${esc(s.title)}</option>`).join("")}
  </select>
  <div id="diagResult" class="section">${diagnosisHTML(DIAG_SCENARIOS[0])}</div>
  <p class="small muted">No WSL2, reproduza com ip addr, ip route, ss -tuln, dig +trace, curl -v e tcpdump -nn -i any. Nunca use ping como prova de porta aberta.</p>
</div>
<div class="card section">
  <div class="row"><h2>Wireshark Labs — Kurose & Ross</h2><span class="pill">${WIRESHARK_LABS.length} capturas</span></div>
  <p class="muted">Marque cada laboratório após inspecionar cabeçalhos reais e anotar o que observou. O progresso fica no seu backup local.</p>
  ${WIRESHARK_LABS.map(([id, name, desc]) => `<label class="check"><input type="checkbox" onchange="Storage.toggleLab('${id}',this.checked)" ${Storage.isLabDone(id) ? "checked" : ""}> <b>${esc(name)}</b> — ${esc(desc)}</label>`).join("")}
</div>`;
  }

  function dbLab() {
    return `
<div class="grid2">
  <div class="card section">
    <h2>Consultas SQL (simulação)</h2>
    <p class="muted">Tabela fictícia <code>alunos(id, nome, cidade, curso, nota)</code>. Escolha uma consulta e veja o resultado calculado localmente.</p>
    <select class="field" id="sqlQuery" aria-label="Consulta SQL de exemplo">
      <option value="q1">Alunos de Recife (projeção e filtro)</option>
      <option value="q2">Nota ≥ 7, ordenada por nota</option>
      <option value="q3">Contagem por curso (GROUP BY)</option>
    </select>
    <div class="actions"><button onclick="ExtraLabs.runSql()">Executar consulta</button></div>
    <div id="sqlResult" class="section"></div>
  </div>
  <div class="card section">
    <h2>Desafio: filtrar antes de projetar</h2>
    <p class="muted">Qual consulta retorna <b>apenas o nome e a cidade</b> dos alunos de Recife?</p>
    ${Object.entries(QUERIES).map(([k, q]) => `<label class="check"><input type="radio" name="sqlChallenge" value="${k}"> <code>${esc(q.sql)}</code></label>`).join("")}
    <div class="actions"><button onclick="ExtraLabs.checkSql()">Verificar</button></div>
    <div class="feedback" id="sqlChallengeFb" aria-live="polite"></div>
  </div>
</div>
<div class="card section">
  <h2>Modelagem rápida</h2>
  <p class="muted">Marque as afirmações corretas sobre chaves e normalização.</p>
  ${[
    ["Chave primária identifica cada linha da tabela.", true],
    ["Chave estrangeira sempre aponta para a mesma tabela.", false],
    ["3FN reduz redundância dependente de atributos não-chave.", true],
    ["Índice acelera leituras, mas tem custo em escritas.", true]
  ].map((x, i) => `<label class="check"><input type="checkbox" id="dbModel${i}" data-ok="${x[1]}"> ${x[0]}</label>`).join("")}
  <div class="actions"><button onclick="ExtraLabs.checkModel()">Corrigir</button></div>
  <div class="feedback" id="dbModelFb" aria-live="polite"></div>
</div>`;
  }

  function checkModel() {
    let ok = 0;
    for (let i = 0; i < 4; i++) {
      const el = document.getElementById("dbModel" + i);
      if (el && el.checked === (el.dataset.ok === "true")) ok++;
    }
    const fb = document.getElementById("dbModelFb");
    if (!fb) return;
    fb.textContent = ok + "/4 afirmações corretas." + (ok === 4 ? " Boa modelagem!" : " Revise chaves estrangeiras e dependências.");
    fb.className = "feedback " + (ok === 4 ? "good" : "bad");
    if (ok === 4 && typeof Storage !== "undefined" && typeof Storage.toggleLab === "function") {
      Storage.toggleLab("db-modelagem", true);
    }
  }

  window.ExtraLabs = {
    networkLab, dbLab, runSubnet, runDns, showPacket, runSql, checkSql, checkModel,
    renderDiagnosis, checkDiagnosis, diagnosisHTML,
    subnetInfo, PACKETS, QUERIES, DIAG_SCENARIOS, WIRESHARK_LABS
  };
})();

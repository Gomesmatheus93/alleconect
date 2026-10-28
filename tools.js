/* Ferramentas de energia do Alle Connect. Dados em energy-data.js; premissas em config.js (energyCalculator). */
"use strict";
window.createAlleTools = ({ config, money, icons, trackEvent }) => {
  const data = window.ALLE_ENERGY_DATA;
  const settings = config.energyCalculator;
  const distributors = data.distributors;
  const tariffOf = item => item.tusd + item.te;
  const flagById = id => settings.flags.find(flag => flag.id === id) || settings.flags[0];
  const nationalAverage = distributors.reduce((sum, item) => sum + tariffOf(item), 0) / distributors.length;
  const kwh = value => `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kWh`;
  const rate = (value, digits = 3) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
  const monthName = month => new Date(`${month}-15`).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }).replace(". de ", "/").replace(" de ", "/").replace(".", "");
  const monthLong = month => new Date(`${month}-15`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const states = { AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins" };
  const ufs = Object.keys(states).sort();
  const svgIcon = paths => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const toolIcons = {
    plug: svgIcon('<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v5"/>'),
    receipt: svgIcon('<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M7 9v.01M17 15v.01"/>'),
    flag: svgIcon('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    sun: svgIcon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    compare: svgIcon('<path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/>'),
    info: svgIcon('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>'),
    percent: svgIcon('<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>'),
    chart: svgIcon('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    map: svgIcon('<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>')
  };

  const distributorSelect = (attrs = "", { placeholder = "Selecione...", uf = "" } = {}) => `<select ${attrs}><option value="">${placeholder}</option>${(uf ? [uf] : ufs).map(state => `<optgroup label="${state}">${distributors.map((item, index) => ({ ...item, index })).filter(item => item.uf === state).map(item => `<option value="${item.index}">${item.name} — ${item.uf} (${rate(tariffOf(item))})</option>`).join("")}</optgroup>`).join("")}</select>`;
  const flagSelect = attrs => `<select ${attrs}>${settings.flags.map(flag => `<option value="${flag.id}">${flag.name}</option>`).join("")}</select>`;
  const field = (label, control) => `<label class="energy-field"><span>${label}</span>${control}</label>`;
  const toolBack = () => `<a class="back-link" href="/calcule-sua-energia" data-link>← Voltar para Calcule sua energia</a>`;
  const toolHeader = (eyebrow, title, text) => `${toolBack()}<header class="page-header"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${text}</p></header>`;
  const sourceNote = extra => `<small class="energy-note">${extra ? `${extra} ` : ""}Tarifas residenciais homologadas pela ANEEL (TUSD + TE), sem impostos, atualizadas em ${data.updatedAt}.</small>`;

  const tools = [
    { path: "/ferramentas/tarifas", icon: icons.calculator, tone: "orange", title: "Tarifas por distribuidora", description: `${distributors.length} distribuidoras com TUSD e TE separados. Compare a mais barata e a mais cara do país.`, action: "Ver ranking completo" },
    { path: "/ferramentas/consumo-aparelhos", icon: toolIcons.plug, tone: "purple", title: "Consumo por aparelho", description: `${settings.appliances.length} aparelhos com consumo e custo mensal na tarifa da sua distribuidora.`, action: "Calcular consumo" },
    { path: "/ferramentas/quanto-custa", icon: toolIcons.receipt, tone: "orange", title: "Quanto custa (kWh)", description: "De 30 a 1.000 kWh: custo por distribuidora e bandeira. Descubra o perfil do seu consumo.", action: "Ver tabela completa" },
    { path: "/ferramentas/bandeira", icon: toolIcons.flag, tone: "orange", title: "Bandeira tarifária", description: "Bandeira vigente, impacto na conta e histórico mês a mês dos últimos dois anos.", action: "Ver bandeira atual" },
    { path: "/ferramentas/solar", icon: toolIcons.sun, tone: "orange", title: "Simulador solar", description: "Irradiação solar da NASA para o seu estado + tarifa local = tamanho do sistema e payback.", action: "Simular payback" },
    { path: "/ferramentas/comparar", icon: toolIcons.compare, tone: "purple", title: "Comparar distribuidoras", description: "Coloque duas distribuidoras lado a lado e veja a diferença na conta para o seu consumo.", action: "Comparar agora" },
    { path: "/ferramentas/estados", icon: toolIcons.map, tone: "purple", title: "Tarifas por estado", description: "Mapa interativo com a tarifa média e as distribuidoras de cada UF. Compare os 27 estados.", action: "Ver mapa de tarifas" }
  ];

  const section = () => `<section class="tools-section"><header><h2>Ferramentas gratuitas</h2><p>Dados oficiais da ANEEL e da NASA para entender e reduzir a sua conta de luz.</p></header><div class="tools-grid">${tools.map(tool => `<a class="tool-card" href="${tool.path}" data-link><span class="tool-icon tool-icon-${tool.tone}">${tool.icon}</span><h3>${tool.title}</h3><p>${tool.description}</p><span class="tool-action">${tool.action} →</span></a>`).join("")}</div></section>`;

  /* Estimativa solar simplificada: irradiação da capital, rendimento e painéis de config.js. */
  const solarEstimate = (uf, monthly, tariff, costPerKwp) => {
    const generationPerKwp = data.solar[uf].hsp * 30 * settings.solar.performanceRatio;
    const panels = Math.ceil(monthly / generationPerKwp / (settings.solar.panelWatts / 1000));
    const systemKwp = panels * settings.solar.panelWatts / 1000;
    const investment = systemKwp * costPerKwp, monthlySaving = Math.min(monthly, systemKwp * generationPerKwp) * tariff;
    return { generationPerKwp, panels, systemKwp, investment, monthlySaving, payback: investment / (monthlySaving * 12) };
  };

  /* Destaques: números das ferramentas e ranking das 5 mais baratas e mais caras */
  const ranked = [...distributors].sort((a, b) => tariffOf(a) - tariffOf(b));
  const rankRow = (item, position, tone) => `<li><span class="rank-badge rank-${tone}">${position}</span><strong>${item.name}</strong><small>${item.uf}</small><b>${rate(tariffOf(item))}</b><small>/kWh</small></li>`;
  const highlights = () => {
    const cheapest = ranked[0], priciest = ranked.at(-1);
    return `<section class="energy-stats" aria-label="Números das ferramentas"><div><strong>${distributors.length}</strong><span>Distribuidoras</span></div><div><strong>${settings.appliances.length}</strong><span>Aparelhos</span></div><div><strong>27</strong><span>Estados com dados solares</span></div><div><strong>${data.flagHistory.length}</strong><span>Meses de bandeiras</span></div></section>
    <section class="ranking-section"><header class="section-title"><span class="ranking-icon" aria-hidden="true">${toolIcons.chart}</span><div><h2>Ranking de tarifas — ${data.updatedAt.slice(-4)}</h2><p>Tarifa residencial (R$/kWh) sem impostos. Fonte: ANEEL.</p></div></header>
      <div class="ranking-grid"><div class="ranking-card ranking-cheap"><h3>5 mais baratas</h3><ol>${ranked.slice(0, 5).map((item, index) => rankRow(item, index + 1, "cheap")).join("")}</ol></div><div class="ranking-card ranking-expensive"><h3>5 mais caras</h3><ol>${ranked.slice(-5).reverse().map((item, index) => rankRow(item, ranked.length - index, "expensive")).join("")}</ol></div></div>
      <div class="ranking-footer"><p>A diferença entre a mais barata e a mais cara é de <strong>${money.format((tariffOf(priciest) - tariffOf(cheapest)) * 200)}/mês</strong> para 200 kWh.</p><a class="ranking-button" href="/ferramentas/tarifas" data-link>Ranking completo (${distributors.length} distribuidoras) <span aria-hidden="true">›</span></a></div>
      <a class="ranking-compare" href="/ferramentas/comparar" data-link>${toolIcons.chart} Comparar duas distribuidoras lado a lado →</a></section>
    <section class="featured-section"><header class="section-title"><span class="ranking-icon" aria-hidden="true">${toolIcons.plug}</span><div><h2>Aparelhos em destaque</h2><p>Custo calculado com a tarifa média das distribuidoras (${rate(nationalAverage)}/kWh), sem impostos.</p></div></header>
      <div class="featured-grid">${settings.appliances.filter(item => item.featured).map(item => { const consumption = item.power * item.hours * item.days / 1000; return `<article class="featured-card"><header><h3>${item.name}</h3><span>${item.power.toLocaleString("pt-BR")} W</span></header><p class="featured-cost"><strong>${money.format(consumption * nationalAverage)}</strong><small>/mês</small><small>(${kwh(consumption)})</small></p><p class="featured-meta">${item.hours.toLocaleString("pt-BR")} h/dia, ${item.days} dias/mês • ${item.category}</p></article>`; }).join("")}</div>
      <a class="featured-more" href="/ferramentas/consumo-aparelhos" data-link>Ver todos os ${settings.appliances.length} aparelhos <span aria-hidden="true">›</span></a></section>
    ${explainer()}${energyFaq()}${guides.section()}`;
  };

  /* Como funciona a tarifa: números calculados a partir dos próprios dados */
  const explainer = () => {
    const mains = ufs.map(uf => stateStats[uf]).sort((a, b) => a.average - b.average);
    const stateSpread = (mains.at(-1).average / mains[0].average - 1) * 100;
    const red2 = flagById("vermelha2"), example = 300;
    const paybacks = ufs.map(uf => solarEstimate(uf, example, stateStats[uf].average, settings.solar.costPerKwp).payback).sort((a, b) => a - b);
    const years = value => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
    const card = (icon, tone, title, text) => `<article class="explainer-card"><h3><span class="tool-icon tool-icon-${tone}" aria-hidden="true">${icon}</span>${title}</h3><p>${text}</p></article>`;
    return `<section class="explainer-section"><header class="section-title"><span class="ranking-icon" aria-hidden="true">${toolIcons.info}</span><div><h2>Como funciona a tarifa de energia no Brasil</h2></div></header>
      <div class="explainer-grid">
        ${card(icons.calculator, "orange", "TUSD + TE = tarifa final", `A tarifa é a soma da <b>TE</b> (tarifa de energia, a geração) com a <b>TUSD</b> (tarifa de uso do sistema, a transmissão e a distribuição). Cada distribuidora tem valores próprios, homologados pela ANEEL nos reajustes anuais. Entre as principais distribuidoras de cada estado, a tarifa varia até <b>${Math.round(stateSpread)}%</b>: de ${rate(mains[0].average)} (${mains[0].main.name}) a ${rate(mains.at(-1).average)} (${mains.at(-1).main.name}).`)}
        ${card(toolIcons.flag, "orange", "Bandeiras: o custo que muda todo mês", `Quando gerar energia fica mais caro, por exemplo em períodos de seca, a ANEEL aciona bandeiras que somam um valor a cada kWh. Na vermelha patamar 2 são <b>${money.format(red2.extra * 100)} a cada 100 kWh</b>: para ${example} kWh/mês, <b>${money.format(red2.extra * example)} a mais</b> na conta. <a href="/ferramentas/bandeira" data-link>Veja a bandeira vigente</a>.`)}
        ${card(toolIcons.percent, "purple", "Impostos: ICMS, PIS e COFINS", `Os impostos são cobrados "por dentro", ou seja, incidem sobre o próprio valor da conta, e por isso pesam mais do que a alíquota sugere. O ICMS varia de estado para estado. As tarifas destas ferramentas são mostradas <b>sem impostos</b>, então o valor final da sua conta tende a ser maior.`)}
        ${card(toolIcons.sun, "orange", `Solar: retorno de ${years(paybacks[0])} a ${years(paybacks.at(-1))} anos`, `Pela nossa estimativa, um sistema para ${example} kWh/mês se paga em ${years(paybacks[0])} a ${years(paybacks.at(-1))} anos, conforme o estado. O cálculo usa a irradiação medida por satélite (NASA) em cada capital e a tarifa da principal distribuidora, com o kWp instalado a ${money.format(settings.solar.costPerKwp)}. Não inclui a cobrança do Fio B. <a href="/ferramentas/solar" data-link>Simule o seu caso</a>.`)}
      </div>
      <div class="explainer-method"><h3>Como calculamos o custo de cada aparelho</h3><p>Fórmula: <code>(potência em W × horas por dia × dias no mês) ÷ 1.000 = kWh/mês</code>. Multiplicamos o resultado pela tarifa homologada pela ANEEL para cada distribuidora (TUSD + TE) e somamos o adicional da bandeira escolhida. As potências são médias de referência; para um valor exato, use a potência da etiqueta do seu aparelho.</p></div></section>`;
  };

  /* Perguntas frequentes: respostas montadas com os dados atuais. Usa o acordeão do app (.accordion-trigger). */
  const energyFaq = () => {
    const year = data.updatedAt.slice(-4), cheapest = ranked[0], priciest = ranked.at(-1);
    const mains = ufs.map(uf => stateStats[uf]).sort((a, b) => a.average - b.average);
    const shower = settings.appliances.find(item => item.power === 5500) || settings.appliances[0];
    const showerKwh = shower.power * shower.hours * shower.days / 1000;
    const top = [...settings.appliances].map(item => ({ ...item, consumption: item.power * item.hours * item.days / 1000 })).sort((a, b) => b.consumption - a.consumption).slice(0, 5);
    const current = data.flagHistory.at(-1);
    const paybacks = ufs.map(uf => solarEstimate(uf, 300, stateStats[uf].average, settings.solar.costPerKwp).payback).sort((a, b) => a - b);
    const years = value => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
    const questions = [
      ["Como calcular o consumo de energia de um aparelho?", `<p>Multiplique a potência do aparelho (em watts) pelas horas de uso por dia e pelos dias de uso no mês, e divida por 1.000. O resultado é o consumo em kWh por mês. Depois, multiplique pela tarifa da sua distribuidora para saber o custo.</p><p>Exemplo: um ${shower.name.toLowerCase()} usado ${shower.hours.toLocaleString("pt-BR")} h por dia, ${shower.days} dias no mês: ${shower.power.toLocaleString("pt-BR")} × ${shower.hours.toLocaleString("pt-BR")} × ${shower.days} ÷ 1.000 = <b>${kwh(showerKwh)}</b>. Com a tarifa média de ${rate(nationalAverage)}, são cerca de <b>${money.format(showerKwh * nationalAverage)}</b> por mês, sem impostos. <a href="/calcule-sua-energia" data-link>Use a calculadora</a> para fazer a conta com a sua distribuidora.</p>`],
      ["Qual distribuidora de energia é mais cara do Brasil?", `<p>Pelas tarifas residenciais homologadas pela ANEEL, a mais cara hoje é a <b>${priciest.name} (${priciest.uf})</b>, com ${rate(tariffOf(priciest))}/kWh sem impostos. A mais barata é a <b>${cheapest.name} (${cheapest.uf})</b>, com ${rate(tariffOf(cheapest))}/kWh.</p><p>Entre as principais distribuidoras de cada estado, a mais cara é a <b>${mains.at(-1).main.name}</b> (${rate(mains.at(-1).average)}) e a mais barata é a <b>${mains[0].main.name}</b> (${rate(mains[0].average)}). <a href="/ferramentas/tarifas" data-link>Veja o ranking completo</a>.</p>`],
      ["O que é bandeira tarifária e quanto ela aumenta a conta?", `<p>A bandeira tarifária sinaliza o custo de gerar energia no mês. Quando as usinas mais caras precisam ser acionadas, por exemplo em períodos de seca, a ANEEL aplica um adicional a cada kWh consumido:</p><ul>${settings.flags.map(flag => `<li><b>${flag.short}</b>: ${flag.extra ? `${money.format(flag.extra * 100)} a cada 100 kWh` : "sem acréscimo"}</li>`).join("")}</ul><p>A bandeira de ${monthLong(current.month)} é a <b>${flagById(current.flag).short.toLowerCase()}</b>. <a href="/ferramentas/bandeira" data-link>Veja o histórico</a>.</p>`],
      [`Quanto custa 1 kWh de energia elétrica no Brasil em ${year}?`, `<p>Sem impostos, a tarifa residencial média das distribuidoras é de <b>${rate(nationalAverage)}/kWh</b>, variando de ${rate(tariffOf(cheapest))} a ${rate(tariffOf(priciest))} conforme a distribuidora. Entre as principais de cada estado, vai de ${rate(mains[0].average)} a ${rate(mains.at(-1).average)}.</p><p>Na conta de luz o valor é maior, porque entram ICMS, PIS, COFINS, a contribuição de iluminação pública e o adicional da bandeira. <a href="/ferramentas/quanto-custa" data-link>Veja quanto custa o seu consumo</a>.</p>`],
      ["Como converter kWh por ano em kWh por mês?", `<p>Divida o valor anual por 12. Por exemplo, um aparelho com consumo de 360 kWh/ano gasta, em média, 360 ÷ 12 = <b>30 kWh/mês</b>.</p><p>Para o caminho inverso, multiplique o consumo mensal por 12. Lembre que aparelhos como ar-condicionado e aquecedor têm uso diferente ao longo do ano, então a média mensal pode esconder meses de consumo bem mais alto.</p>`],
      ["Como calcular o consumo de energia pelo medidor?", `<ol><li>Anote o número que aparece no medidor (em kWh) e a data.</li><li>Depois de alguns dias, anote o número de novo.</li><li>Subtraia a primeira leitura da segunda: o resultado é o consumo no período.</li><li>Para estimar o mês, divida pelo número de dias e multiplique por 30.</li></ol><p>Exemplo: leituras de 12.430 e 12.502 kWh com 7 dias de intervalo dão 72 kWh, ou cerca de 309 kWh por mês. Para descobrir quanto um aparelho específico gasta, faça as leituras com ele ligado e com ele desligado.</p>`],
      ["Quais aparelhos mais gastam energia em casa?", `<p>Considerando um uso típico, os que mais pesam no mês são:</p><ol>${top.map(item => `<li><b>${item.name}</b>: cerca de ${kwh(item.consumption)} (${item.hours.toLocaleString("pt-BR")} h/dia)</li>`).join("")}</ol><p>Aparelhos que esquentam ou esfriam, como chuveiro, aquecedores e ar-condicionado, costumam liderar a conta. <a href="/ferramentas/consumo-aparelhos" data-link>Compare todos os ${settings.appliances.length} aparelhos</a>.</p>`],
      [`Vale a pena energia solar em ${year}?`, `<p>Para muitas casas, sim. Pela nossa estimativa, um sistema para 300 kWh/mês se paga em <b>${years(paybacks[0])} a ${years(paybacks.at(-1))} anos</b>, conforme o estado, e os painéis duram 25 anos ou mais. Mas exige investimento inicial, telhado adequado, e a cobrança gradual do Fio B (Lei 14.300/2022) reduz a economia com o tempo.</p><p>Se você quer economizar sem investir nem fazer obra, a Alle oferece até ${config.discountPercentage}% de desconto na conta a partir do primeiro mês. <a href="/ferramentas/solar" data-link>Simule o solar</a> e compare.</p>`]
    ];
    return `<section class="energy-faq"><h2>Perguntas frequentes</h2><div class="accordion">${questions.map(([question, answer], index) => `<div class="accordion-item"><h3><button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="energy-faq-${index}"><span class="faq-question">${question}</span><span class="faq-toggle" aria-hidden="true">+</span></button></h3><div class="accordion-panel" id="energy-faq-${index}" hidden><div>${answer}</div></div></div>`).join("")}</div></section>`;
  };

  /* 1. Tarifas por distribuidora */
  const tariffsPage = () => `<section class="page tool-page">${toolHeader("Ranking ANEEL", "Tarifas por distribuidora", "Compare a tarifa residencial de todas as distribuidoras do Brasil, com TUSD (uso da rede) e TE (energia) separados.")}
    <div class="tool-stats"><div><span>Mais barata</span><strong data-stat-min></strong><small data-stat-min-name></small></div><div><span>Média</span><strong data-stat-avg></strong><small data-stat-avg-label></small></div><div><span>Mais cara</span><strong data-stat-max></strong><small data-stat-max-name></small></div></div>
    <div class="tool-panel"><div class="tool-filters">${field("Estado", `<select data-filter-uf><option value="">Todos os estados</option>${ufs.map(uf => `<option value="${uf}">${uf} — ${states[uf]}</option>`).join("")}</select>`)}${field("Buscar", `<input data-filter-search type="search" placeholder="Nome da distribuidora" autocomplete="off">`)}${field("Ordenar", `<select data-filter-sort><option value="asc">Menor tarifa primeiro</option><option value="desc">Maior tarifa primeiro</option><option value="name">Nome (A–Z)</option></select>`)}</div>
    <div class="tool-table-wrap"><table class="tool-table"><thead><tr><th>#</th><th>Distribuidora</th><th>UF</th><th class="num">TUSD</th><th class="num">TE</th><th class="num">Total R$/kWh</th><th class="num">Vigência desde</th></tr></thead><tbody data-rows></tbody></table></div><p class="tool-empty" data-empty hidden>Nenhuma distribuidora encontrada.</p></div>
    ${sourceNote("Na base da ANEEL, as classes residencial, rural e comercial têm a mesma tarifa base; descontos como tarifa social e rural são aplicados à parte.")}</section>`;
  const setupTariffs = root => {
    const uf = root.querySelector("[data-filter-uf]"), search = root.querySelector("[data-filter-search]"), sort = root.querySelector("[data-filter-sort]"), rows = root.querySelector("[data-rows]"), empty = root.querySelector("[data-empty]");
    const normalized = value => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const set = (selector, value) => { root.querySelector(selector).textContent = value; };
    const update = () => {
      const term = normalized(search.value.trim());
      const list = distributors.filter(item => (!uf.value || item.uf === uf.value) && normalized(item.name).includes(term)).sort((a, b) => sort.value === "name" ? a.name.localeCompare(b.name, "pt-BR") : sort.value === "desc" ? tariffOf(b) - tariffOf(a) : tariffOf(a) - tariffOf(b));
      rows.innerHTML = list.map((item, index) => `<tr><td>${index + 1}</td><td><strong>${item.name}</strong></td><td>${item.uf}</td><td class="num">${rate(item.tusd)}</td><td class="num">${rate(item.te)}</td><td class="num"><strong>${rate(tariffOf(item))}</strong></td><td class="num">${new Date(`${item.validFrom}T12:00`).toLocaleDateString("pt-BR")}</td></tr>`).join("");
      empty.hidden = list.length > 0;
      const byPrice = [...list].sort((a, b) => tariffOf(a) - tariffOf(b));
      if (!byPrice.length) { ["[data-stat-min]", "[data-stat-avg]", "[data-stat-max]", "[data-stat-min-name]", "[data-stat-max-name]", "[data-stat-avg-label]"].forEach(selector => set(selector, "—")); return; }
      set("[data-stat-min]", rate(tariffOf(byPrice[0]))); set("[data-stat-min-name]", `${byPrice[0].name} — ${byPrice[0].uf}`);
      set("[data-stat-max]", rate(tariffOf(byPrice.at(-1)))); set("[data-stat-max-name]", `${byPrice.at(-1).name} — ${byPrice.at(-1).uf}`);
      set("[data-stat-avg]", rate(byPrice.reduce((sum, item) => sum + tariffOf(item), 0) / byPrice.length)); set("[data-stat-avg-label]", `${byPrice.length} ${byPrice.length === 1 ? "distribuidora" : "distribuidoras"}`);
    };
    [uf, sort].forEach(control => control.addEventListener("change", update)); search.addEventListener("input", update);
    update();
  };

  /* 2. Consumo por aparelho */
  const categories = [...new Set(settings.appliances.map(item => item.category))];
  const appliancesPage = () => `<section class="page tool-page">${toolHeader("Consumo por aparelho", "Quanto gasta cada aparelho", "Veja o consumo mensal e o custo de cada aparelho na tarifa da sua distribuidora. Ajuste as horas de uso para o seu dia a dia.")}
    <div class="tool-panel"><div class="tool-filters">${field("Distribuidora", distributorSelect("data-distributor", { placeholder: `Média nacional (${rate(nationalAverage)})` }))}${field("Bandeira", flagSelect("data-flag"))}${field("Categoria", `<select data-category><option value="">Todas as categorias</option>${categories.map(category => `<option>${category}</option>`).join("")}</select>`)}</div>
    <div class="tool-table-wrap"><table class="tool-table"><thead><tr><th>Aparelho</th><th class="num">Potência</th><th class="num">Horas/dia</th><th class="num">Dias/mês</th><th class="num">Consumo</th><th class="num">Custo/mês</th></tr></thead><tbody data-rows>${settings.appliances.map((item, index) => `<tr data-index="${index}" data-category="${item.category}"><td><strong>${item.name}</strong><small>${item.category}</small></td><td class="num">${item.power.toLocaleString("pt-BR")} W</td><td class="num"><input class="table-input" data-hours type="number" inputmode="decimal" min="0" max="24" step="0.25" value="${item.hours}" aria-label="Horas por dia — ${item.name}"></td><td class="num"><input class="table-input" data-days type="number" inputmode="numeric" min="0" max="31" step="1" value="${item.days}" aria-label="Dias por mês — ${item.name}"></td><td class="num" data-kwh></td><td class="num"><strong data-cost></strong></td></tr>`).join("")}</tbody></table></div></div>
    ${sourceNote("Potências médias de referência; confira a etiqueta do seu aparelho para um valor exato.")}</section>`;
  const setupAppliances = root => {
    const distributor = root.querySelector("[data-distributor]"), flag = root.querySelector("[data-flag]"), category = root.querySelector("[data-category]");
    const update = () => {
      const price = (distributor.value ? tariffOf(distributors[Number(distributor.value)]) : nationalAverage) + flagById(flag.value).extra;
      root.querySelectorAll("[data-index]").forEach(row => {
        const item = settings.appliances[Number(row.dataset.index)];
        const hours = Math.min(24, Math.max(0, Number(row.querySelector("[data-hours]").value) || 0)), days = Math.min(31, Math.max(0, Number(row.querySelector("[data-days]").value) || 0));
        const consumption = item.power * hours * days / 1000;
        row.hidden = Boolean(category.value) && row.dataset.category !== category.value;
        row.querySelector("[data-kwh]").textContent = kwh(consumption);
        row.querySelector("[data-cost]").textContent = money.format(consumption * price);
      });
    };
    root.addEventListener("input", update); root.addEventListener("change", update);
    update();
  };

  /* 3. Quanto custa */
  const profiles = [
    { max: 100, name: "Econômico", text: "Consumo típico de uma casa pequena ou de quem mora sozinho, com poucos aparelhos de alta potência." },
    { max: 200, name: "Moderado", text: "Consumo comum de uma família pequena, com geladeira, chuveiro elétrico e eletrônicos do dia a dia." },
    { max: 400, name: "Alto", text: "Família maior ou uso frequente de ar-condicionado, chuveiro elétrico e outros aparelhos potentes." },
    { max: Infinity, name: "Muito alto", text: "Uso intenso de climatização, piscina, aquecimento ou carro elétrico. Aqui a economia com a Alle faz mais diferença." }
  ];
  const costPage = () => `<section class="page tool-page">${toolHeader("Quanto custa o kWh", "Quanto custa a sua conta de luz", "Escolha a sua distribuidora e veja o custo de 30 a 1.000 kWh em cada bandeira tarifária.")}
    <div class="tool-panel"><div class="tool-filters">${field("Distribuidora", distributorSelect("data-distributor", { placeholder: `Média nacional (${rate(nationalAverage)})` }))}${field("Seu consumo mensal (kWh)", `<input data-consumption type="number" inputmode="numeric" min="1" step="1" placeholder="Ex: 220">`)}</div>
    <div class="tool-profile" data-profile hidden></div>
    <div class="tool-table-wrap"><table class="tool-table"><thead><tr><th>Consumo</th>${settings.flags.map(flag => `<th class="num"><span class="flag-dot flag-${flag.id}" aria-hidden="true"></span>${flag.short}</th>`).join("")}</tr></thead><tbody data-rows></tbody></table></div></div>
    ${sourceNote("Valores sem impostos (ICMS, PIS e COFINS) e sem a contribuição de iluminação pública.")}</section>`;
  const setupCost = root => {
    const distributor = root.querySelector("[data-distributor]"), consumption = root.querySelector("[data-consumption]"), rows = root.querySelector("[data-rows]"), profile = root.querySelector("[data-profile]");
    const update = () => {
      const base = distributor.value ? tariffOf(distributors[Number(distributor.value)]) : nationalAverage;
      const own = Math.round(Number(consumption.value));
      const levels = [...new Set([...settings.consumptionLevels, ...(own > 0 ? [own] : [])])].sort((a, b) => a - b);
      rows.innerHTML = levels.map(level => `<tr class="${level === own ? "is-highlight" : ""}"><td><strong>${kwh(level)}</strong>${level === own ? "<small>seu consumo</small>" : ""}</td>${settings.flags.map(flag => `<td class="num">${money.format(level * (base + flag.extra))}</td>`).join("")}</tr>`).join("");
      if (own > 0) {
        const match = profiles.find(item => own <= item.max), cost = own * base;
        profile.innerHTML = `<span class="eyebrow">Perfil de consumo</span><strong>${match.name}</strong><p>${match.text}</p><p>Com ${kwh(own)} por mês, a sua conta fica em cerca de <b>${money.format(cost)}</b> na bandeira verde. Com a Alle, a economia pode chegar a <b>${money.format(cost * config.discountPercentage / 100)}</b> por mês.</p>`;
      }
      profile.hidden = !(own > 0);
    };
    distributor.addEventListener("change", update); consumption.addEventListener("input", update);
    update();
  };

  /* 4. Bandeira tarifária */
  const flagPage = () => {
    const current = data.flagHistory.at(-1), currentFlag = flagById(current.flag);
    return `<section class="page tool-page">${toolHeader("Bandeira tarifária", "Bandeira vigente", "A bandeira indica o custo de geração de energia no mês e acrescenta um valor a cada kWh consumido.")}
    <div class="flag-current flag-bg-${currentFlag.id}"><span class="eyebrow">Bandeira de ${monthLong(current.month)}</span><strong>${currentFlag.short}</strong><p>${currentFlag.extra ? `Acréscimo de ${money.format(currentFlag.extra * 100)} a cada 100 kWh consumidos.` : "Sem acréscimo na conta de luz neste mês."}</p></div>
    <div class="tool-panel"><h2>Impacto de cada bandeira na conta</h2><div class="tool-table-wrap"><table class="tool-table"><thead><tr><th>Bandeira</th><th class="num">Por kWh</th>${[100, 200, 300, 500].map(level => `<th class="num">${level} kWh</th>`).join("")}</tr></thead><tbody>${settings.flags.map(flag => `<tr class="${flag.id === currentFlag.id ? "is-highlight" : ""}"><td><span class="flag-dot flag-${flag.id}" aria-hidden="true"></span><strong>${flag.short}</strong>${flag.id === currentFlag.id ? "<small>vigente</small>" : ""}</td><td class="num">${flag.extra ? rate(flag.extra, 5) : "—"}</td>${[100, 200, 300, 500].map(level => `<td class="num">${flag.extra ? `+ ${money.format(level * flag.extra)}` : "—"}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>
    <div class="tool-panel"><h2>Histórico dos últimos ${data.flagHistory.length} meses</h2><ol class="flag-history">${data.flagHistory.map(item => `<li class="flag-bg-${item.flag}" title="${monthLong(item.month)}: ${flagById(item.flag).name}"><span>${monthName(item.month)}</span><strong>${flagById(item.flag).short}</strong></li>`).join("")}</ol><div class="flag-legend">${settings.flags.map(flag => `<span><i class="flag-dot flag-${flag.id}" aria-hidden="true"></i>${flag.short}: ${data.flagHistory.filter(item => item.flag === flag.id).length} ${data.flagHistory.filter(item => item.flag === flag.id).length === 1 ? "mês" : "meses"}</span>`).join("")}</div></div>
    <small class="energy-note">Fonte: ANEEL, acionamento das bandeiras tarifárias (dados abertos), atualizado em ${data.updatedAt}. A bandeira do mês seguinte é divulgada pela ANEEL na última sexta-feira de cada mês.</small></section>`;
  };

  /* 5. Simulador solar */
  const solarPage = () => `<section class="page tool-page">${toolHeader("Simulador solar", "Quanto custa gerar a sua própria energia", "Combinamos a irradiação solar medida por satélite (NASA) na capital do seu estado com a tarifa da sua distribuidora para estimar o sistema e o retorno do investimento.")}
    <form class="tool-panel" data-solar-form novalidate><div class="tool-filters">${field("Estado", `<select data-uf required><option value="">Selecione...</option>${ufs.map(uf => `<option value="${uf}">${uf} — ${states[uf]}</option>`).join("")}</select>`)}${field("Distribuidora", `<select data-distributor disabled><option value="">Escolha o estado primeiro</option></select>`)}${field("Consumo mensal (kWh)", `<input data-consumption type="number" inputmode="numeric" min="1" step="1" placeholder="Ex: 300" required>`)}${field("Custo do kWp instalado (R$)", `<input data-cost type="number" inputmode="numeric" min="1" step="100" value="${settings.solar.costPerKwp}">`)}</div>
    <p class="energy-error" data-error role="alert" hidden></p><button class="energy-submit" type="submit"><span aria-hidden="true">☀</span> Simular payback</button>
    <div class="solar-result" data-result aria-live="polite" hidden></div></form>
    <small class="energy-note">Estimativa simplificada: irradiação média anual da capital (NASA POWER), rendimento de ${Math.round(settings.solar.performanceRatio * 100)}% e painéis de ${settings.solar.panelWatts} W. Não considera a taxa mínima da distribuidora nem a cobrança gradual do Fio B (Lei 14.300/2022). Peça um projeto a um instalador para valores exatos.</small></section>`;
  const setupSolar = root => {
    const form = root.querySelector("[data-solar-form]"), uf = form.querySelector("[data-uf]"), distributor = form.querySelector("[data-distributor]"), consumption = form.querySelector("[data-consumption]"), cost = form.querySelector("[data-cost]"), error = form.querySelector("[data-error]"), result = form.querySelector("[data-result]");
    uf.addEventListener("change", () => {
      const wrapper = document.createElement("div"); wrapper.innerHTML = distributorSelect("data-distributor", { placeholder: "Selecione...", uf: uf.value });
      distributor.innerHTML = uf.value ? wrapper.firstElementChild.innerHTML : `<option value="">Escolha o estado primeiro</option>`;
      distributor.disabled = !uf.value;
      if (uf.value && distributor.options.length === 2) distributor.selectedIndex = 1;
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      const monthly = Number(consumption.value), price = Number(cost.value);
      const message = !uf.value ? "Selecione o seu estado." : !distributor.value ? "Selecione a sua distribuidora." : !(monthly > 0) ? "Informe o seu consumo mensal em kWh." : !(price > 0) ? "Informe o custo do kWp instalado." : "";
      error.textContent = message; error.hidden = !message;
      if (message) { result.hidden = true; return; }
      const solar = data.solar[uf.value], selected = distributors[Number(distributor.value)];
      const { generationPerKwp, panels, systemKwp, investment, monthlySaving, payback } = solarEstimate(uf.value, monthly, tariffOf(selected), price);
      result.innerHTML = `<div class="tool-stats"><div><span>Irradiação em ${solar.city}</span><strong>${solar.hsp.toLocaleString("pt-BR")} kWh/m²/dia</strong><small>média anual NASA POWER</small></div><div><span>Sistema recomendado</span><strong>${systemKwp.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kWp</strong><small>${panels} painéis de ${settings.solar.panelWatts} W</small></div><div><span>Geração estimada</span><strong>${kwh(systemKwp * generationPerKwp)}/mês</strong><small>para ${kwh(monthly)} de consumo</small></div></div>
        <div class="tool-stats"><div><span>Investimento estimado</span><strong>${money.format(investment)}</strong></div><div><span>Economia na conta</span><strong>${money.format(monthlySaving)}/mês</strong><small>tarifa ${selected.name}: ${rate(tariffOf(selected))}</small></div><div class="is-accent"><span>Retorno do investimento</span><strong>${payback.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} anos</strong></div></div>
        <div class="energy-alle"><span>Sem investimento e sem obra: com a Alle você pode economizar até</span><strong>${money.format(monthly * tariffOf(selected) * config.discountPercentage / 100)}</strong><small>por mês, com ${config.discountPercentage}% de desconto na fatura, a partir do primeiro mês.</small></div><button class="calculator-conversion" type="button" data-calculator-contact>QUERO ECONOMIZAR <span aria-hidden="true">→</span></button>`;
      result.hidden = false;
      trackEvent("solar_simulated", { state: uf.value, distributor: selected.name, consumption: monthly });
    });
  };

  /* 6. Tarifas por estado (mapa em grade: cada estado é um quadrado na posição aproximada) */
  const tilePositions = { RR: [1, 0], AP: [3, 0], AM: [1, 1], PA: [3, 1], MA: [4, 1], CE: [5, 1], RN: [6, 1], AC: [0, 2], RO: [1, 2], MT: [2, 2], TO: [3, 2], PI: [4, 2], PE: [5, 2], PB: [6, 2], GO: [2, 3], DF: [3, 3], BA: [4, 3], SE: [5, 3], AL: [6, 3], MS: [1, 4], MG: [3, 4], ES: [4, 4], SP: [2, 5], RJ: [3, 5], PR: [2, 6], SC: [2, 7], RS: [2, 8] };
  /* Distribuidora com mais clientes em cada estado; é ela que define a tarifa "do estado" no mapa. */
  const mainDistributors = { AC: "Energisa AC", AL: "Equatorial AL", AP: "CEA Equatorial", AM: "Âmbar Amazonas", BA: "Neoenergia Coelba", CE: "Enel CE", DF: "Neoenergia Brasília", ES: "EDP ES", GO: "Equatorial GO", MA: "Equatorial MA", MT: "Energisa MT", MS: "Energisa MS", MG: "Cemig", PA: "Equatorial PA", PB: "Energisa PB", PR: "Copel", PE: "Neoenergia Pernambuco", PI: "Equatorial PI", RJ: "Light", RN: "Neoenergia Cosern", RS: "RGE", RO: "Energisa RO", RR: "Âmbar Roraima", SC: "Celesc", SP: "Enel SP", SE: "Energisa SE", TO: "Energisa TO" };
  const stateStats = Object.fromEntries(ufs.map(uf => {
    const list = distributors.filter(item => item.uf === uf).sort((a, b) => tariffOf(a) - tariffOf(b));
    const main = list.find(item => item.name === mainDistributors[uf]) || list[0];
    return [uf, { list, main, average: tariffOf(main) }];
  }));
  const averages = ufs.map(uf => stateStats[uf].average).sort((a, b) => a - b);
  const statesAverage = averages.reduce((sum, value) => sum + value, 0) / averages.length;
  const bins = [0.2, 0.4, 0.6, 0.8].map(q => averages[Math.floor(q * (averages.length - 1))]);
  const binOf = value => bins.filter(limit => value > limit).length;
  const statesPage = () => `<section class="page tool-page">${toolHeader("Mapa de tarifas", "Tarifas por estado", "Compare a tarifa residencial da principal distribuidora de cada estado. Toque em um estado para ver todas as distribuidoras e a irradiação solar.")}
    <div class="states-layout"><div class="tool-panel"><div class="tile-map" role="group" aria-label="Mapa do Brasil por tarifa média">${ufs.map(uf => `<button type="button" class="tile tile-bin-${binOf(stateStats[uf].average)}" style="grid-column:${tilePositions[uf][0] + 1};grid-row:${tilePositions[uf][1] + 1}" data-uf="${uf}" aria-label="${states[uf]}: ${stateStats[uf].main.name}, ${rate(stateStats[uf].average)}" title="${states[uf]} — ${stateStats[uf].main.name}: ${rate(stateStats[uf].average)}"><strong>${uf}</strong><span>${stateStats[uf].average.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></button>`).join("")}</div>
      <div class="tile-legend"><span>Tarifa da principal distribuidora (R$/kWh)</span><ol>${[0, 1, 2, 3, 4].map(bin => `<li><i class="tile-bin-${bin}" aria-hidden="true"></i>${bin === 0 ? `até ${rate(bins[0], 2)}` : bin === 4 ? `acima de ${rate(bins[3], 2)}` : `${rate(bins[bin - 1], 2)} – ${rate(bins[bin], 2)}`}</li>`).join("")}</ol></div></div>
      <aside class="tool-panel state-detail" data-detail aria-live="polite"></aside></div>
    <div class="tool-panel"><h2>Todos os estados</h2><div class="tool-table-wrap"><table class="tool-table"><thead><tr><th>#</th><th>Estado</th><th>Principal distribuidora</th><th class="num">Tarifa</th><th class="num">Menor</th><th class="num">Maior</th><th class="num">Distribuidoras</th><th class="num">Irradiação solar</th></tr></thead><tbody>${[...ufs].sort((a, b) => stateStats[a].average - stateStats[b].average).map((uf, index) => `<tr><td>${index + 1}</td><td><strong>${states[uf]}</strong><small>${uf}</small></td><td>${stateStats[uf].main.name}</td><td class="num"><strong>${rate(stateStats[uf].average)}</strong></td><td class="num">${rate(tariffOf(stateStats[uf].list[0]))}</td><td class="num">${rate(tariffOf(stateStats[uf].list.at(-1)))}</td><td class="num">${stateStats[uf].list.length}</td><td class="num">${data.solar[uf].hsp.toLocaleString("pt-BR")} kWh/m²/dia</td></tr>`).join("")}</tbody></table></div></div>
    ${sourceNote("A cor de cada estado usa a tarifa da distribuidora com mais clientes. Irradiação solar: NASA POWER, média anual na capital.")}</section>`;
  const setupStates = root => {
    const detail = root.querySelector("[data-detail]");
    const show = uf => {
      const stats = stateStats[uf];
      root.querySelectorAll(".tile").forEach(tile => tile.setAttribute("aria-pressed", String(tile.dataset.uf === uf)));
      detail.innerHTML = `<span class="eyebrow">${uf}</span><h2>${states[uf]}</h2><div class="tool-stats"><div><span>${stats.main.name}</span><strong>${rate(stats.average)}</strong><small>${stats.average > statesAverage ? "acima" : "abaixo"} da média dos estados (${rate(statesAverage)})</small></div><div><span>Irradiação solar</span><strong>${data.solar[uf].hsp.toLocaleString("pt-BR")}</strong><small>kWh/m²/dia em ${data.solar[uf].city}</small></div></div><h3>${stats.list.length} ${stats.list.length === 1 ? "distribuidora" : "distribuidoras"}</h3><ul class="state-list">${stats.list.map(item => `<li><span>${item.name}${item === stats.main ? " <small>principal</small>" : ""}</span><strong>${rate(tariffOf(item))}</strong></li>`).join("")}</ul>`;
    };
    root.querySelector(".tile-map").addEventListener("click", event => { const tile = event.target.closest("[data-uf]"); if (tile) { show(tile.dataset.uf); trackEvent("state_map_selected", { state: tile.dataset.uf }); } });
    show("SP");
  };

  /* 7. Comparar distribuidoras */
  const comparePage = () => `<section class="page tool-page">${toolHeader("Comparar distribuidoras", "Duas distribuidoras lado a lado", "Escolha duas distribuidoras e o seu consumo para ver a diferença de tarifa e de custo na conta de luz.")}
    <div class="tool-panel"><div class="tool-filters">${field("Distribuidora A", distributorSelect("data-compare-a"))}${field("Distribuidora B", distributorSelect("data-compare-b"))}${field("Consumo mensal (kWh)", `<input data-consumption type="number" inputmode="numeric" min="1" step="1" value="200">`)}${field("Bandeira", flagSelect("data-flag"))}</div>
    <div class="compare-result" data-result aria-live="polite"><p class="tool-empty">Escolha as duas distribuidoras para comparar.</p></div></div>
    ${sourceNote()}</section>`;
  const setupCompare = root => {
    const a = root.querySelector("[data-compare-a]"), b = root.querySelector("[data-compare-b]"), consumption = root.querySelector("[data-consumption]"), flag = root.querySelector("[data-flag]"), result = root.querySelector("[data-result]");
    a.value = String(distributors.indexOf(ranked[0])); b.value = String(distributors.indexOf(ranked.at(-1)));
    const update = () => {
      if (!a.value || !b.value) { result.innerHTML = `<p class="tool-empty">Escolha as duas distribuidoras para comparar.</p>`; return; }
      const monthly = Math.max(0, Number(consumption.value) || 0), extra = flagById(flag.value).extra;
      const items = [distributors[Number(a.value)], distributors[Number(b.value)]];
      const costs = items.map(item => monthly * (tariffOf(item) + extra));
      const cheaper = costs[0] === costs[1] ? -1 : costs[0] < costs[1] ? 0 : 1;
      const row = (label, values) => `<tr><th scope="row">${label}</th>${values.map(value => `<td class="num">${value}</td>`).join("")}</tr>`;
      result.innerHTML = `<div class="tool-table-wrap"><table class="tool-table compare-table"><thead><tr><th></th>${items.map((item, index) => `<th class="num">${item.name} — ${item.uf}${index === cheaper ? ' <span class="compare-tag">mais barata</span>' : ""}</th>`).join("")}</tr></thead><tbody>${row("TUSD (R$/kWh)", items.map(item => rate(item.tusd)))}${row("TE (R$/kWh)", items.map(item => rate(item.te)))}${row("Tarifa total (R$/kWh)", items.map(item => `<strong>${rate(tariffOf(item))}</strong>`))}${row("Posição no ranking", items.map(item => `${ranked.indexOf(item) + 1}º de ${ranked.length}`))}${row(`Conta com ${kwh(monthly)}`, costs.map(cost => `<strong>${money.format(cost)}</strong>`))}${row("Em 12 meses", costs.map(cost => money.format(cost * 12)))}</tbody></table></div>
        <div class="tool-stats"><div class="is-accent"><span>Diferença por mês</span><strong>${money.format(Math.abs(costs[0] - costs[1]))}</strong></div><div><span>Diferença em 12 meses</span><strong>${money.format(Math.abs(costs[0] - costs[1]) * 12)}</strong></div><div><span>Diferença na tarifa</span><strong>${costs[0] && costs[1] ? `${(Math.abs(tariffOf(items[0]) - tariffOf(items[1])) / Math.min(tariffOf(items[0]), tariffOf(items[1])) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%` : "—"}</strong></div></div>`;
    };
    root.addEventListener("change", update); consumption.addEventListener("input", update);
    update();
  };

  const guides = window.createAlleGuides({
    config, money, rate, kwh, nationalAverage, svgIcon, flags: settings.flags, flagHistory: data.flagHistory, appliances: settings.appliances,
    solarPayback: monthly => { const values = ufs.map(uf => solarEstimate(uf, monthly, stateStats[uf].average, settings.solar.costPerKwp).payback).sort((a, b) => a - b); const format = value => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 }); return { min: format(values[0]), max: format(values.at(-1)) }; }
  });

  const routes = {
    "/ferramentas/tarifas": { title: "Tarifas por distribuidora", render: tariffsPage, setup: setupTariffs },
    "/ferramentas/consumo-aparelhos": { title: "Consumo por aparelho", render: appliancesPage, setup: setupAppliances },
    "/ferramentas/quanto-custa": { title: "Quanto custa o kWh", render: costPage, setup: setupCost },
    "/ferramentas/bandeira": { title: "Bandeira tarifária", render: flagPage, setup: () => {} },
    "/ferramentas/solar": { title: "Simulador solar", render: solarPage, setup: setupSolar },
    "/ferramentas/estados": { title: "Tarifas por estado", render: statesPage, setup: setupStates },
    "/ferramentas/comparar": { title: "Comparar distribuidoras", render: comparePage, setup: setupCompare },
    ...guides.routes
  };

  return { routes, section, highlights, distributorSelect, flagSelect, tariffOf, distributors, updatedAt: data.updatedAt };
};

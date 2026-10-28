/* Guias de energia do Alle Connect. Os números vêm dos dados das ferramentas (tools.js), então se atualizam junto com as tarifas. */
"use strict";
window.createAlleGuides = ({ config, money, rate, kwh, nationalAverage, flags, flagHistory, appliances, solarPayback, svgIcon }) => {
  const percent = value => `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
  const costOf = kwhValue => money.format(kwhValue * nationalAverage);
  const appliance = name => appliances.find(item => item.name === name);
  const flag = id => flags.find(item => item.id === id);
  const link = (path, text) => `<a href="${path}" data-link>${text}</a>`;
  const icons = {
    bill: svgIcon('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/>'),
    flag: svgIcon('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    sun: svgIcon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    piggy: svgIcon('<path d="M19 10c0-3.3-3.1-6-7-6S5 6.7 5 10c0 2 1.1 3.7 2.8 4.8L8 19h3v-2h2v2h3l.4-3.2A6 6 0 0 0 19 12h2v-3h-2.2"/><path d="M15 9v.01"/>'),
    percent: svgIcon('<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>'),
    chart: svgIcon('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>')
  };

  /* Dicas de economia: kWh economizados por mês, calculados a partir da mudança de hábito descrita. */
  const shower = appliance("Chuveiro elétrico 5.500 W");
  const tips = [
    { title: "Reduza o banho em 5 minutos", text: `No chuveiro de ${shower.power.toLocaleString("pt-BR")} W, 5 minutos a menos por dia em uma casa com 3 pessoas.`, kwh: shower.power * (5 / 60) * 3 * 30 / 1000 },
    { title: "Use a posição verão do chuveiro", text: "Na posição verão o chuveiro usa cerca de metade da potência. Considerando 30 minutos de banho por dia nos meses quentes.", kwh: shower.power / 2 * 0.5 * 30 / 1000 },
    { title: "Troque 8 lâmpadas incandescentes por LED", text: "Lâmpada de 60 W por uma LED de 9 W com a mesma luminosidade, acesas 6 horas por dia.", kwh: (60 - 9) * 8 * 6 * 30 / 1000 },
    { title: "Ar-condicionado: 2 horas a menos por dia", text: "Programe o timer para desligar de madrugada. Ar de 12.000 BTU inverter (900 W).", kwh: 900 * 2 * 30 / 1000 },
    { title: "Prefira o ventilador nos dias amenos", text: "Ventilador de teto (120 W) no lugar do ar-condicionado de 12.000 BTU (900 W), 4 horas por dia em 10 dias do mês.", kwh: (900 - 120) * 4 * 10 / 1000 },
    { title: "Tire os aparelhos da tomada", text: "TV, micro-ondas, decodificador e carregadores em espera somam, em média, uns 15 W ligados 24 horas.", kwh: 15 * 24 * 30 / 1000 },
    { title: "Lave roupa com a máquina cheia", text: "Juntar a roupa e fazer 4 lavagens a menos por mês em uma máquina de 500 W (1 hora por ciclo).", kwh: 500 * 1 * 4 / 1000 },
    { title: "Evite a secadora em dias de sol", text: "Secar no varal 4 cargas por mês em vez de usar uma secadora de 3.000 W por 1 hora.", kwh: 3000 * 1 * 4 / 1000 },
    { title: "Passe roupa de uma vez só", text: "Juntar as peças e ligar o ferro (1.000 W) 4 vezes a menos por mês, 1 hora cada.", kwh: 1000 * 1 * 4 / 1000 },
    { title: "Troque o forno elétrico pela air fryer", text: "Para pequenas porções, a air fryer (1.500 W) assa em cerca de metade do tempo do forno elétrico (1.500 W). 12 usos de 30 minutos por mês.", kwh: 1500 * 0.25 * 12 / 1000 },
    { title: "Reduza a filtragem da piscina", text: "Bomba de 1/2 cv (750 W): 2 horas a menos por dia, quando a piscina está pouco usada.", kwh: 750 * 2 * 30 / 1000 },
    { title: "Desligue o computador quando não estiver usando", text: "Computador de mesa (200 W) desligado 3 horas a mais por dia, nos dias úteis.", kwh: 200 * 3 * 22 / 1000 },
    { title: "Regule a temperatura do boiler", text: "Programar o aquecedor de água (3.000 W) para funcionar 1 hora a menos por dia.", kwh: 3000 * 1 * 30 / 1000 },
    { title: "Carregue o carro elétrico com planejamento", text: "Evitar 4 recargas completas desnecessárias de 1 hora por mês em um carregador de 7 kW.", kwh: 7000 * 1 * 4 / 1000 },
    { title: "Confira a vedação da geladeira", text: "Borracha gasta faz o motor trabalhar mais. Estimativa: 10% do consumo de uma geladeira frost free (60 W, 24 h).", kwh: 60 * 24 * 30 / 1000 * 0.1 }
  ];
  const tipsTotal = tips.reduce((sum, tip) => sum + tip.kwh, 0);

  const paybacks = solarPayback(300);
  const red1 = flag("vermelha1"), red2 = flag("vermelha2"), yellow = flag("amarela");
  const redMonths = flagHistory.filter(item => item.flag.startsWith("vermelha")).length;

  const guides = [
    {
      path: "/guias/conta-de-luz", icon: icons.bill, tone: "blue", title: "Como ler a conta de luz", description: "Entenda TUSD, TE, bandeiras, impostos e cada campo da sua fatura.",
      intro: "A conta de luz parece complicada, mas segue sempre a mesma lógica: quanto você consumiu, quanto custa cada kWh e o que é somado por cima. Veja o que significa cada parte.",
      sections: [
        ["Dados da unidade consumidora", `<p>No topo da fatura ficam o <b>número da instalação</b> (ou unidade consumidora), o titular, o endereço e a <b>classificação</b>. Residências normalmente são do <b>grupo B, subgrupo B1 — residencial</b>. Esse número é o que você informa para a distribuidora ou para a Alle em qualquer atendimento.</p>`],
        ["Leitura e consumo", `<p>A distribuidora lê o medidor uma vez por mês. A fatura mostra a <b>leitura anterior</b>, a <b>leitura atual</b> e a diferença entre elas, que é o seu <b>consumo em kWh</b> no período. Confira também o número de dias faturados: um ciclo de 33 dias naturalmente consome mais que um de 28.</p>`],
        ["TUSD e TE: o preço da energia", `<p>O valor do kWh é dividido em duas partes:</p><ul><li><b>TE (tarifa de energia)</b>: o custo de gerar a energia.</li><li><b>TUSD (tarifa de uso do sistema de distribuição)</b>: o custo de transportar a energia pelas redes de transmissão e distribuição até a sua casa.</li></ul><p>As duas são homologadas pela ANEEL para cada distribuidora. Hoje, sem impostos, a média das distribuidoras é de ${rate(nationalAverage)}/kWh. ${link("/ferramentas/tarifas", "Veja a tarifa da sua distribuidora")}.</p>`],
        ["Bandeira tarifária", `<p>Se a bandeira do mês for amarela ou vermelha, a fatura traz uma linha extra com o adicional por kWh. Na vermelha patamar 2, por exemplo, são ${money.format(red2.extra * 100)} a cada 100 kWh. ${link("/guias/bandeiras-tarifarias", "Entenda as bandeiras")}.</p>`],
        ["Impostos e contribuições", `<p>Sobre o valor da energia incidem <b>ICMS</b> (estadual), <b>PIS e COFINS</b> (federais). Eles são calculados "por dentro", o que faz o peso real ser maior que a alíquota. Há ainda a <b>contribuição de iluminação pública</b> (CIP ou COSIP), cobrada pelo município. ${link("/guias/icms-conta-de-luz", "Veja como o ICMS é calculado")}.</p>`],
        ["Histórico e vencimento", `<p>O gráfico de histórico mostra o consumo dos últimos 12 meses. Use-o para identificar meses fora do padrão, que podem indicar um aparelho com defeito ou um erro de leitura. Pague até o vencimento para evitar multa e juros.</p>`]
      ]
    },
    {
      path: "/guias/bandeiras-tarifarias", icon: icons.flag, tone: "red", title: "Bandeiras tarifárias — guia completo", description: "Como funcionam, quando mudam e como se proteger da vermelha.",
      intro: "As bandeiras tarifárias avisam quando gerar energia está mais caro. Elas mudam todo mês e podem pesar bastante na conta.",
      sections: [
        ["Por que existem", `<p>A maior parte da energia do Brasil vem de hidrelétricas. Quando os reservatórios estão baixos, é preciso acionar usinas térmicas, que são mais caras. A bandeira repassa esse custo extra mês a mês, em vez de esperar o reajuste anual da tarifa.</p>`],
        ["Os quatro níveis", `<ul>${flags.map(item => `<li><b>${item.short}</b>: ${item.extra ? `${money.format(item.extra * 100)} a cada 100 kWh consumidos` : "sem acréscimo"}</li>`).join("")}</ul><p>Para uma casa que consome 200 kWh/mês, a amarela soma ${money.format(yellow.extra * 200)}, a vermelha patamar 1 soma ${money.format(red1.extra * 200)} e a vermelha patamar 2 soma ${money.format(red2.extra * 200)}, sem impostos.</p>`],
        ["Quando mudam", `<p>A ANEEL define a bandeira de cada mês com base nas condições de geração e divulga a decisão no fim do mês anterior. Nos últimos ${flagHistory.length} meses, a bandeira foi vermelha em ${redMonths} ${redMonths === 1 ? "mês" : "meses"}. ${link("/ferramentas/bandeira", "Veja o histórico completo e a bandeira vigente")}.</p>`],
        ["Como se proteger da vermelha", `<ul><li>Acompanhe a bandeira do mês e redobre a atenção com chuveiro, ar-condicionado e aquecedores quando ela estiver vermelha.</li><li>Concentre tarefas como lavar e passar roupa em menos dias.</li><li>Troque aparelhos antigos por modelos mais eficientes, com selo Procel A.</li><li>Com a Alle, o desconto na fatura ajuda a compensar os meses de bandeira cara.</li></ul>`]
      ]
    },
    {
      path: "/guias/energia-solar", icon: icons.sun, tone: "yellow", title: "Energia solar residencial — guia", description: "Custos, payback, legislação, financiamento e o que mudou com a Lei 14.300.",
      intro: "Gerar a própria energia com painéis solares pode reduzir muito a conta, mas exige investimento e alguns cuidados. Veja o que considerar antes de decidir.",
      sections: [
        ["Como funciona", `<p>Os painéis no telhado geram energia durante o dia. O que você não consome na hora vai para a rede da distribuidora e vira <b>crédito</b>, que abate o consumo da noite e dos meses seguintes. É o chamado sistema de compensação de energia (geração distribuída).</p>`],
        ["Quanto custa e em quanto tempo se paga", `<p>O preço depende do tamanho do sistema, medido em kWp. Nas nossas ferramentas usamos ${money.format(config.energyCalculator.solar.costPerKwp)} por kWp instalado como referência. Com essa premissa, um sistema para 300 kWh/mês se paga em <b>${paybacks.min} a ${paybacks.max} anos</b>, conforme a irradiação e a tarifa de cada estado. Os painéis costumam durar 25 anos ou mais. ${link("/ferramentas/solar", "Simule o seu caso")}.</p>`],
        ["O que mudou com a Lei 14.300/2022", `<p>Sistemas conectados a partir de 2023 passaram a pagar, de forma gradual, uma parte da <b>TUSD Fio B</b> (o uso da rede de distribuição) sobre a energia injetada e compensada. O percentual cobrado sobe ano a ano até a regra definitiva, o que reduz um pouco a economia e alonga o tempo de retorno em relação aos sistemas antigos.</p>`],
        ["Financiamento", `<p>Bancos e cooperativas de crédito têm linhas específicas para energia solar. Compare a parcela com a economia mensal estimada: o ideal é que a economia cubra a maior parte da parcela. Peça mais de um orçamento e confira se o instalador cuida da homologação junto à distribuidora.</p>`],
        ["E se eu não puder instalar?", `<p>Quem mora em apartamento, aluga o imóvel ou não quer investir pode economizar de outro jeito. A Alle oferece até ${config.discountPercentage}% de desconto na conta de luz, sem obra e sem investimento. ${link("/calculadora", "Simule a sua economia com a Alle")}.</p>`]
      ]
    },
    {
      path: "/guias/como-economizar-energia", icon: icons.piggy, tone: "green", title: "Como economizar energia", description: `${tips.length} dicas práticas com economia estimada em R$ por mês.`,
      intro: `Pequenas mudanças de hábito somam. Juntas, as ${tips.length} dicas abaixo podem economizar cerca de ${kwh(tipsTotal)} por mês, ou ${costOf(tipsTotal)} com a tarifa média de ${rate(nationalAverage)}/kWh, sem impostos. Nem todas valem para todas as casas: some só as que fazem sentido para você.`,
      sections: [["Dicas", `<ol class="guide-tips">${tips.map(tip => `<li><div><strong>${tip.title}</strong><p>${tip.text}</p></div><span><b>${costOf(tip.kwh)}</b><small>/mês · ${kwh(tip.kwh)}</small></span></li>`).join("")}</ol><p>Quer saber quanto cada aparelho gasta na sua casa? ${link("/ferramentas/consumo-aparelhos", "Use a ferramenta de consumo por aparelho")}.</p>`]]
    },
    {
      path: "/guias/icms-conta-de-luz", icon: icons.percent, tone: "purple", title: "ICMS na conta de luz", description: "Como o imposto é calculado, por que pesa mais do que parece e o que está mudando.",
      intro: "O ICMS é o imposto estadual que mais pesa na conta de luz. Entender como ele é calculado ajuda a ler a fatura e a comparar valores.",
      sections: [
        ["O que é", `<p>O ICMS (Imposto sobre Circulação de Mercadorias e Serviços) é cobrado pelos estados. Cada estado define a sua alíquota para a energia elétrica, e por isso a mesma quantidade de energia pode custar valores diferentes de um estado para outro. A alíquota aplicada aparece na sua fatura.</p>`],
        ["Por que pesa mais do que a alíquota", `<p>O ICMS é calculado "por dentro": o imposto faz parte da própria base sobre a qual ele é cobrado. O mesmo vale para PIS e COFINS. A conta fica assim:</p><p class="guide-formula">valor com impostos = valor sem impostos ÷ (1 − ICMS − PIS − COFINS)</p><p>Exemplo hipotético: com ICMS de 18% e PIS/COFINS somando 5%, uma conta de ${money.format(100)} sem impostos vai para ${money.format(100 / (1 - 0.23))}. O aumento real é de ${percent((1 / (1 - 0.23) - 1) * 100)}, e não de 23%.</p>`],
        ["Energia é serviço essencial", `<p>Desde a Lei Complementar 194/2022, energia elétrica é considerada bem essencial, e os estados não podem cobrar sobre ela uma alíquota maior que a alíquota geral do ICMS. Alguns estados também isentam faixas de consumo baixo ou consumidores da tarifa social.</p>`],
        ["O que vai mudar com a reforma tributária", `<p>A reforma tributária (Emenda Constitucional 132/2023) prevê a substituição gradual do ICMS pelo IBS, e de PIS e COFINS pela CBS, ao longo da transição prevista na lei. A forma de cálculo na conta de luz deve mudar ao longo desse período.</p>`],
        ["Onde ver a alíquota do seu estado", `<p>A alíquota e o valor do ICMS estão discriminados na sua fatura, na área de tributos. Para a regra completa do seu estado, consulte a Secretaria da Fazenda estadual. As tarifas das nossas ferramentas são mostradas sem impostos. ${link("/guias/conta-de-luz", "Veja como ler a conta de luz")}.</p>`]
      ]
    },
    {
      path: "/guias/mercado-livre-de-energia", icon: icons.chart, tone: "teal", title: "Mercado livre de energia", description: "Como funciona, quem pode migrar hoje e qual a alternativa para residências.",
      intro: "No mercado livre, o consumidor escolhe de quem compra a energia e negocia preço e prazo. Veja quem já pode participar e o que existe para quem ainda não pode.",
      sections: [
        ["Mercado cativo e mercado livre", `<p>No <b>mercado cativo</b> (ACR), você compra a energia da distribuidora da sua região, pela tarifa regulada pela ANEEL. No <b>mercado livre</b> (ACL), o consumidor compra a energia de geradoras ou comercializadoras, negociando preço, prazo e origem. A distribuidora continua entregando a energia e cobrando pelo uso da rede (TUSD).</p>`],
        ["Quem pode migrar", `<p>Desde janeiro de 2024, todos os consumidores do <b>grupo A</b>, atendidos em média ou alta tensão, como indústrias e grandes comércios, podem migrar. Os de menor porte precisam ser representados por uma comercializadora varejista.</p><p>Consumidores do <b>grupo B</b>, de baixa tensão, como residências e pequenos comércios, ainda não podem migrar. A abertura para esse público está em discussão; acompanhe as regras da ANEEL e do Ministério de Minas e Energia.</p>`],
        ["Vantagens e cuidados", `<ul><li><b>Vantagens</b>: preço negociado, previsibilidade em contratos longos e escolha da fonte de energia.</li><li><b>Cuidados</b>: contratos com prazos e multas, exposição a variações de preço e necessidade de gestão do consumo.</li></ul>`],
        ["E para residências?", `<p>Mesmo sem acesso ao mercado livre, quem tem conta residencial já pode economizar. A Alle oferece até ${config.discountPercentage}% de desconto na conta de luz, sem obra, sem investimento e sem trocar de distribuidora. ${link("/calculadora", "Simule a sua economia")}.</p>`]
      ]
    }
  ];

  const section = () => `<section class="guides-section"><header class="section-title"><span class="ranking-icon" aria-hidden="true">${svgIcon('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>')}</span><div><h2>Guias e referência</h2></div></header><div class="guides-grid">${guides.map(guide => `<a class="guide-card" href="${guide.path}" data-link><span class="guide-icon guide-icon-${guide.tone}" aria-hidden="true">${guide.icon}</span><span><strong>${guide.title}</strong><small>${guide.description}</small></span></a>`).join("")}</div></section>`;

  const page = guide => () => `<section class="page tool-page guide-page"><a class="back-link" href="/calcule-sua-energia" data-link>← Voltar para Calcule sua energia</a><header class="page-header"><span class="eyebrow">Guia</span><h1>${guide.title}</h1><p>${guide.intro}</p></header>
    <article class="guide-article">${guide.sections.map(([title, body]) => `<section><h2>${title}</h2>${body}</section>`).join("")}</article>
    <aside class="guide-cta"><div><strong>Economize até ${config.discountPercentage}% na conta de luz</strong><p>Sem obra, sem investimento e sem trocar de distribuidora.</p></div><button class="calculator-conversion" type="button" data-calculator-contact>QUERO ECONOMIZAR <span aria-hidden="true">→</span></button></aside>
    <nav class="guide-related" aria-label="Outros guias"><h2>Outros guias</h2><div class="guides-grid">${guides.filter(item => item !== guide).map(item => `<a class="guide-card" href="${item.path}" data-link><span class="guide-icon guide-icon-${item.tone}" aria-hidden="true">${item.icon}</span><span><strong>${item.title}</strong><small>${item.description}</small></span></a>`).join("")}</div></nav></section>`;

  const routes = Object.fromEntries(guides.map(guide => [guide.path, { title: guide.title, render: page(guide), setup: () => {} }]));
  return { section, routes };
};

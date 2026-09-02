(() => {
  "use strict";
  const config = window.ALLE_CONFIG;
  const main = document.querySelector("#main-content");
  const contactModal = document.querySelector("#contact-modal");
  const unitsModal = document.querySelector("#units-modal");
  const unitSearch = document.querySelector("#unit-search");
  const unitsList = document.querySelector("#units-list");
  const stateFilters = document.querySelector("#state-filters");
  let selectedState = "TODOS";
  let contactOrigin = "general";
  let lastFocusedElement = null;

  const svgIcon = paths => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const icons = {
    calculator: svgIcon('<path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/>'),
    chat: svgIcon('<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8M8 13h5"/>'),
    allpfit: svgIcon('<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>'),
    client: svgIcon('<circle cx="10" cy="8" r="4"/><path d="M3 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 3.5 1.4M17 19l2 2 3-4"/>'),
    invoice: svgIcon('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
    edit: svgIcon('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>'),
    support: svgIcon('<path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2ZM20 13a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2ZM17 17c0 2-2 3-5 3"/>'),
    share: svgIcon('<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>'),
    faq: svgIcon('<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.3 1.9c-1.5 1-2.4 1.7-2.4 3.1M12 18h.01"/>')
  };
  const money = new Intl.NumberFormat("pt-BR", { style:"currency", currency:"BRL" });

  function trackEvent(name, properties = {}) {
    if (typeof window.gtag === "function") window.gtag("event", name, properties);
    else if (location.hostname === "localhost" || location.hostname === "127.0.0.1") console.info("[Alle Analytics]", name, properties);
  }

  function createWhatsAppLink(phone, message) {
    const cleanPhone = String(phone).replace(/\D/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  function openExternal(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const serviceCard = ({ icon, title, description, action, className = "", attrs = "" }) => `
    <button class="service-card ${className}" type="button" ${attrs}>
      <span class="card-icon" aria-hidden="true">${icon}</span><h2>${title}</h2><p>${description}</p><span class="card-action">${action} →</span>
    </button>`;

  const backLink = () => `<a class="back-link" href="/" data-link>← Voltar ao início</a>`;

  function renderBitrixForm() {
    return `<div class="bitrix-form-host" id="bitrix-form-host"><div class="bitrix-loading"><span></span><strong>Carregando formulário seguro...</strong></div></div>`;
  }

  const quickCalculator = prefix => `<section class="quick-calculator" data-calculator="${prefix}"><span class="calculator-label">Simulador rápido</span><div class="quick-calculator-grid"><div class="slider-panel"><p>Arraste ou digite para definir a média da sua fatura mensal de energia.</p><div class="slider-title"><label for="${prefix}-bill-input">Fatura mensal</label><div class="editable-value"><span>R$</span><input id="${prefix}-bill-input" data-bill-input inputmode="numeric" value="500,00" aria-label="Valor mensal da fatura"></div></div><input class="bill-range" id="${prefix}-bill-range" data-bill-range type="range" min="300" max="10000" step="50" value="500" aria-label="Arraste para definir o valor da fatura"><div class="range-labels"><span>R$ 300</span><span>R$ 10.000</span></div></div><div class="saving-panel"><div class="saving-result"><div><span>Economia mensal (${config.discountPercentage}%)</span><strong data-monthly-saving>${money.format(500*config.discountPercentage/100)}</strong></div><div class="annual-result"><span>Economia anual</span><strong data-annual-saving>${money.format(500*config.discountPercentage/100*12)}</strong></div></div><button class="calculator-conversion" type="button" data-calculator-contact>QUERO GARANTIR MINHA ECONOMIA <span aria-hidden="true">→</span></button><small>Estimativa sujeita às condições comerciais e características da unidade consumidora.</small></div></div></section>`;

  const pages = {
    adhesion: () => `<section class="page adhesion-page">${backLink()}<header class="adhesion-hero"><span class="eyebrow">Comece a economizar</span><h1>Faça sua adesão à Alle</h1><p>Preencha o formulário para iniciar sua análise ou fale agora com nossa equipe pelo WhatsApp.</p></header><div class="adhesion-layout"><section class="bitrix-container">${renderBitrixForm()}</section><aside class="adhesion-contact"><span class="adhesion-contact-icon">${icons.chat}</span><span class="eyebrow">Prefere conversar?</span><h2>Fale com um especialista Alle</h2><p>Tire suas dúvidas e receba orientação durante o processo de adesão.</p><ul><li><i>✓</i> Atendimento humanizado</li><li><i>✓</i> Orientação personalizada</li><li><i>✓</i> Canal direto pelo WhatsApp</li></ul><button class="button" type="button" data-direct-contact="adhesion">FALAR NO WHATSAPP <span>→</span></button></aside></div></section>`,
    home: () => `<section class="page home-page"><section class="landing-hero"><div class="hero-copy"><span class="eyebrow">Energia inteligente para você</span><h1>Economize na conta de energia <em>sem complicação.</em></h1><p>Com a Alle, você tem economia, atendimento próximo e benefícios exclusivos em um único lugar.</p><div class="hero-actions"><a class="button button-primary" href="#simulador">SIMULAR MINHA ECONOMIA <span aria-hidden="true">↓</span></a><button class="button button-secondary" type="button" data-contact>FALAR COM UM ESPECIALISTA</button></div><div class="hero-proof"><span><i>✓</i> Simulação gratuita</span><span><i>✓</i> Processo simples</span><span><i>✓</i> Atendimento humano</span></div></div><aside class="hero-card"><div class="hero-card-head"><span>Estimativa de economia</span><span class="status-pill"><i></i> Online</span></div><div class="hero-card-value"><small>economize até</small><strong>${config.discountPercentage}%</strong><span>todos os meses*</span></div><div class="bill-comparison"><div><span>Conta atual</span><strong>R$ 500</strong></div><span class="comparison-arrow">→</span><div class="new-bill"><span>Com a Alle</span><strong>R$ 450</strong></div></div><button type="button" data-route="/calculadora">Fazer minha simulação <span>↗</span></button><small>*Valor ilustrativo. A economia pode variar.</small></aside></section><div id="simulador">${quickCalculator("home")}</div><section class="services-section"><header class="section-heading"><div><span class="eyebrow">Como podemos ajudar?</span><h2>Encontre o que precisa</h2></div><p>Acesse nossos principais serviços.</p></header><div class="service-grid">
      ${serviceCard({icon:icons.calculator,title:"Calcule sua economia",description:"Veja quanto você pode economizar na sua conta de energia.",action:"Calcular economia",className:"featured",attrs:'data-route="/calculadora"'})}
      ${serviceCard({icon:icons.chat,title:"Falar com a Alle",description:"Fale com nossa equipe de atendimento.",action:"Falar agora",attrs:"data-contact"})}
      ${serviceCard({icon:icons.allpfit,title:"Sou aluno Allpfit",description:"Condições especiais para alunos Allpfit.",action:"Selecionar minha unidade",className:"allpfit",attrs:"data-allpfit"})}
      ${serviceCard({icon:icons.client,title:"Já sou cliente Alle",description:"Acesse atendimento e serviços para clientes.",action:"Acessar",attrs:'data-route="/cliente"'})}
    </div></section><section class="how-section"><div><span class="eyebrow">Simples do início ao fim</span><h2>Comece a economizar em três passos</h2><p>Uma experiência rápida, transparente e acompanhada pela nossa equipe.</p></div><ol><li><span>01</span><div><strong>Simule sua economia</strong><p>Informe o valor médio da sua conta.</p></div></li><li><span>02</span><div><strong>Fale com a Alle</strong><p>Nossa equipe analisa o seu perfil.</p></div></li><li><span>03</span><div><strong>Aproveite o benefício</strong><p>Economia simples, todos os meses.</p></div></li></ol></section><section class="landing-links"><div><span class="eyebrow">Conte com a Alle</span><h2>Informação e suporte sempre perto.</h2></div><div class="small-links"><a class="small-link" href="/duvidas" data-link>Dúvidas frequentes <span>→</span></a><a class="small-link" href="/conheca" data-link>Conheça a Alle <span>→</span></a><a class="small-link" href="${config.contacts.officialSite}" target="_blank" rel="noopener noreferrer" data-site-link>Site oficial <span>↗</span></a></div></section><section class="final-cta"><div><span class="eyebrow">Pronto para começar?</span><h2>Sua energia pode custar menos.</h2><p>Faça uma simulação gratuita e descubra seu potencial de economia.</p></div><button class="button" type="button" data-route="/calculadora">CALCULAR AGORA <span>→</span></button></section></section>`,
    calculator: () => `<section class="page calculator-page">${backLink()}<header class="page-header"><span class="eyebrow">Simulação personalizada</span><h1>Descubra quanto você pode economizar</h1><p>Ajuste o valor da sua conta e veja a estimativa em tempo real.</p></header>${quickCalculator("page")}</section>`,
    client: () => `<section class="page client-page">${backLink()}<header class="client-hero"><div><span class="eyebrow">Área do cliente</span><h1>Olá, cliente Alle</h1><p>Resolva tudo o que precisa em poucos cliques.</p></div><button class="client-help" type="button" data-direct-contact="client_service"><span>${icons.chat}</span><span><small>Atendimento disponível</small><strong>Falar com a equipe</strong></span><i aria-hidden="true">→</i></button></header><div class="client-section-heading"><div><span class="eyebrow">Acesso rápido</span><h2>Como podemos ajudar?</h2></div><p>Escolha um serviço para continuar.</p></div><div class="action-grid client-actions">
      ${actionCard("chat","Falar com atendimento","Atendimento rápido pelo WhatsApp",'data-direct-contact="client_service"')}${actionCard("invoice","Entender minha fatura","Tire suas dúvidas com a equipe",'data-direct-contact="invoice_help"')}${actionCard("edit","Atualizar meus dados","Solicite uma atualização cadastral",'data-direct-contact="update_data"')}${actionCard("support","Suporte","Conte com o time Alle",'data-direct-contact="support"')}${actionCard("share","Indique a Alle","Compartilhe economia",'data-direct-contact="referral"')}${actionCard("faq","Dúvidas frequentes","Encontre respostas rápidas",'data-route="/duvidas"')}
    </div><aside class="client-note"><span>${icons.support}</span><div><strong>Precisa de outro tipo de suporte?</strong><p>Fale com a equipe Alle e explique o que precisa.</p></div><button type="button" data-direct-contact="support">SOLICITAR AJUDA <span>→</span></button></aside></section>`,
    faq: () => `<section class="page faq-page">${backLink()}<header class="faq-hero"><div><span class="eyebrow">Central de ajuda</span><h1>Como podemos ajudar?</h1><p>Encontre respostas rápidas sobre adesão, faturamento e atendimento.</p></div><span class="faq-hero-icon">${icons.chat}</span></header><div class="faq-toolbar"><label class="faq-search"><span aria-hidden="true">⌕</span><input id="faq-search" type="search" placeholder="Busque uma dúvida..." autocomplete="off"><kbd>ESC</kbd></label><span class="faq-count"><strong id="faq-count">${config.faq.length}</strong> respostas disponíveis</span></div><div class="accordion">${config.faq.map((item,i)=>`<article class="accordion-item" data-faq-item data-question="${item.question.toLowerCase()}"><h2><button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="faq-${i}"><span class="faq-number">${String(i+1).padStart(2,"0")}</span><span class="faq-question">${item.question}</span><span class="faq-toggle" aria-hidden="true">+</span></button></h2><div class="accordion-panel" id="faq-${i}" hidden><div>${item.answer}</div></div></article>`).join("")}</div><div class="faq-empty" id="faq-empty" hidden><span>?</span><strong>Nenhuma dúvida encontrada</strong><p>Tente buscar por outro termo ou fale com nossa equipe.</p><button class="button button-primary" type="button" data-contact>FALAR COM A ALLE</button></div><aside class="faq-contact"><div><span class="faq-contact-icon">${icons.chat}</span><span><strong>Não encontrou sua resposta?</strong><small>Nossa equipe está pronta para ajudar.</small></span></div><button class="button" type="button" data-contact>FALAR COM A EQUIPE <span>→</span></button></aside></section>`,
    about: () => `<section class="page">${backLink()}<header class="page-header"><span class="eyebrow">Sobre a Alle</span><h1>${config.institutional.title}</h1></header><section class="content-panel about-panel"><h2>Energia que acompanha você.</h2><p>${config.institutional.description}</p><a class="button button-primary" href="${config.contacts.officialSite}" target="_blank" rel="noopener noreferrer" data-site-link>VISITAR SITE OFICIAL</a></section></section>`,
    notFound: () => `<section class="page"><header class="page-header"><span class="eyebrow">Página não encontrada</span><h1>Este caminho não existe.</h1><p>Volte ao portal para acessar os serviços Alle.</p></header><a class="button button-primary" href="/" data-link>IR PARA O INÍCIO</a></section>`
  };

  function actionCard(icon, title, subtitle, attrs) { return `<button class="action-card" type="button" ${attrs}><span class="card-icon" aria-hidden="true">${icons[icon]}</span><span><strong>${title}</strong><small>${subtitle}</small></span><span class="action-arrow" aria-hidden="true">→</span></button>`; }

  function normalizePath(path) { return path !== "/" ? path.replace(/\/$/, "") : path; }
  function renderPage({ focus = false } = {}) {
    const path = normalizePath(location.pathname);
    const key = path === "/" ? "home" : path === "/calculadora" ? "calculator" : path === "/adesao" ? "adhesion" : path === "/cliente" ? "client" : path === "/duvidas" ? "faq" : path === "/conheca" ? "about" : "notFound";
    main.innerHTML = pages[key]();
    document.title = key === "home" ? "Alle Connect | Alle Energia" : `${({calculator:"Calculadora",adhesion:"Adesão",client:"Área do cliente",faq:"Dúvidas",about:"Conheça a Alle",notFound:"Página não encontrada"})[key]} | Alle Connect`;
    document.querySelectorAll("[data-nav]").forEach(item => item.classList.toggle("active", item.dataset.nav === ({home:"home",calculator:"calculator",client:"client"})[key]));
    if (key === "home") { setupCalculator("home"); document.querySelector(".new-bill strong").textContent=money.format(500-(500*config.discountPercentage/100)); setupHomeExperience(); }
    if (key === "calculator") setupCalculator("page");
    if (key === "adhesion") { setupBitrixForm(); setupAdhesionCopy(); }
    if (key === "faq") setupFaq();
    if (key === "client") trackEvent("client_area_opened");
    window.scrollTo(0,0);
    if (focus) main.focus({ preventScroll:true });
  }

  function navigate(path) { history.pushState({}, "", path); renderPage({ focus:true }); }

  function openModal(modal) {
    closeModals(false); lastFocusedElement = document.activeElement; modal.hidden = false; document.body.style.overflow = "hidden";
    requestAnimationFrame(() => (modal.querySelector("button, input") || modal).focus());
  }
  function closeModals(restoreFocus = true) { [contactModal,unitsModal].forEach(m=>m.hidden=true); document.body.style.overflow=""; if(restoreFocus && lastFocusedElement) lastFocusedElement.focus(); }
  function showContact(origin = "general") { contactOrigin = origin; openModal(contactModal); }
  function showUnits() { const focusTarget=contactModal.hidden?document.activeElement:lastFocusedElement; selectedState="TODOS"; unitSearch.value=""; renderStateFilters(); renderUnits(); openModal(unitsModal); lastFocusedElement=focusTarget; }

  function renderStateFilters() {
    const states=["TODOS",...new Set(config.allpfitUnits.map(unit=>unit.uf))];
    stateFilters.innerHTML=states.map(state=>`<button class="state-filter ${selectedState===state?"active":""}" type="button" data-state="${state}">${state}</button>`).join("");
  }
  function normalized(value) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(); }
  function renderUnits() {
    const query=normalized(unitSearch.value.trim());
    const units=config.allpfitUnits.filter(unit=>(selectedState==="TODOS"||unit.uf===selectedState)&&normalized(`${unit.name} ${unit.uf}`).includes(query));
    unitsList.innerHTML=units.length?`<p class="units-count">${units.length} ${units.length===1?"unidade encontrada":"unidades encontradas"}</p>`+units.map(unit=>`<button class="unit-item" type="button" data-unit-index="${config.allpfitUnits.indexOf(unit)}"><span class="unit-state">${unit.uf}</span><span class="unit-info"><strong>${unit.name}</strong><small><i></i> Atendimento Allpfit</small></span><span class="unit-action">Selecionar <i aria-hidden="true">→</i></span></button>`).join(""):`<div class="empty-state"><span>⌕</span><strong>Nenhuma unidade encontrada</strong><small>Tente buscar por outro nome, cidade ou estado.</small></div>`;
  }

  function openGeneralWhatsApp(origin) {
    const message=origin==="calculator"?config.messages.calculator:config.messages.general;
    trackEvent("whatsapp_clicked",{origin}); openExternal(createWhatsAppLink(config.contacts.generalWhatsApp,message)); closeModals();
  }

  function digitsToCurrency(raw) { const digits=raw.replace(/\D/g,"").slice(0,12); return digits ? (Number(digits)/100).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}) : ""; }
  function parseCurrency(value) { return Number(value.replace(/\./g,"").replace(",",".")); }
  function setupCalculator(prefix) {
    const root=document.querySelector(`[data-calculator="${prefix}"]`);if(!root)return;
    const input=root.querySelector("[data-bill-input]"),range=root.querySelector("[data-bill-range]"),monthlyOutput=root.querySelector("[data-monthly-saving]"),annualOutput=root.querySelector("[data-annual-saving]");
    const update=value=>{const bill=Math.min(10000,Math.max(300,Number(value)||300));const monthly=bill*config.discountPercentage/100;input.value=bill.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});range.value=String(bill);range.style.setProperty("--range-progress",`${((bill-300)/(10000-300))*100}%`);monthlyOutput.textContent=money.format(monthly);annualOutput.textContent=money.format(monthly*12);};
    const started=()=>trackEvent("calculator_started",{location:prefix});input.addEventListener("focus",started,{once:true});range.addEventListener("pointerdown",started,{once:true});
    range.addEventListener("input",()=>update(range.value));
    input.addEventListener("input",()=>{input.value=digitsToCurrency(input.value);const value=parseCurrency(input.value);if(Number.isFinite(value)&&value>0)update(value);});
    input.addEventListener("blur",()=>update(parseCurrency(input.value)));
    const conversionButton=root.querySelector("[data-calculator-contact]");conversionButton.childNodes[0].nodeValue="QUERO ECONOMIZAR ";conversionButton.addEventListener("click",()=>trackEvent("calculator_completed",{bill_value:Number(range.value),discount_percentage:config.discountPercentage,location:prefix}));
    update(range.value);
  }

  function setupHomeExperience() {
    document.querySelector(".hero-actions [data-contact]")?.remove();
    const simulator=document.querySelector("#simulador");
    const rail=document.createElement("section");rail.className="benefits-grid";rail.setAttribute("aria-label","Benefícios Alle");rail.innerHTML=`<article class="benefit-card benefit-orange"><span class="benefit-icon">${svgIcon('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 7h6M9 11h3"/><path d="m13 14 2 2 3-4"/>')}</span><div><h2>Economia de ${config.discountPercentage}% na fatura</h2><p>Simule gratuitamente quanto você pode economizar todos os meses.</p></div></article><article class="benefit-card"><span class="benefit-icon">${svgIcon('<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 6h4M9 12l2 2 4-4M11 18h2"/>')}</span><div><h2>Uma jornada simples e digital</h2><p>Do primeiro contato à análise do seu perfil, tudo foi pensado para ser fácil.</p></div></article><article class="benefit-card"><span class="benefit-icon">${svgIcon('<path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2ZM20 13a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2ZM17 17c0 2-2 3-5 3"/><circle cx="11" cy="20" r="1"/>')}</span><div><h2>Atendimento personalizado</h2><p>Fale com a equipe Alle ou acesse o canal exclusivo da sua unidade Allpfit.</p></div></article>`;simulator.before(rail);
    document.querySelector(".hero-copy>p").textContent="Economize com energia digital: uma experiência simples, conectada e inteligente para reduzir sua conta todos os meses.";
    const proofItems=document.querySelectorAll(".hero-proof span");if(proofItems[2])proofItems[2].innerHTML="<i>✓</i> Atendente de IA";
    const benefitCards=rail.querySelectorAll(".benefit-card");benefitCards[1].querySelector("h2").textContent="Economia com energia digital";benefitCards[1].querySelector("p").textContent="Acompanhe uma jornada conectada, prática e pensada para simplificar sua relação com a energia.";benefitCards[2].querySelector("h2").textContent="Atendente de IA";benefitCards[2].querySelector("p").textContent="Conte com atendimento inteligente para tirar dúvidas e encontrar rapidamente o canal certo.";
    const revealItems=document.querySelectorAll(".benefits-grid,.services-section,.how-section,.landing-links,.final-cta,.quick-calculator");
    if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.12});revealItems.forEach(item=>{item.classList.add("reveal-section");observer.observe(item);});}else revealItems.forEach(item=>item.classList.add("is-visible"));
    document.querySelectorAll(".service-card").forEach(card=>card.addEventListener("pointermove",event=>{const box=card.getBoundingClientRect();card.style.setProperty("--pointer-x",`${event.clientX-box.left}px`);card.style.setProperty("--pointer-y",`${event.clientY-box.top}px`);}));
  }

  function setupFaq() {
    const input=document.querySelector("#faq-search"),items=[...document.querySelectorAll("[data-faq-item]")],count=document.querySelector("#faq-count"),empty=document.querySelector("#faq-empty");
    const filter=()=>{const query=normalized(input.value.trim());let visible=0;items.forEach(item=>{const match=normalized(item.dataset.question).includes(query)||normalized(item.textContent).includes(query);item.hidden=!match;if(match)visible++;});count.textContent=String(visible);empty.hidden=visible!==0;};
    input.addEventListener("input",filter);input.addEventListener("keydown",event=>{if(event.key==="Escape"){input.value="";filter();input.blur();}});
  }

  function setupBitrixForm() {
    const host=document.querySelector("#bitrix-form-host");
    const bitrix=config.contacts.bitrixForm;
    if(!host||!bitrix?.code||!bitrix?.loaderUrl)return;
    const embed=document.createElement("script");
    embed.setAttribute("data-b24-form",bitrix.code);
    embed.setAttribute("data-skip-moving","true");
    embed.textContent=`(function(w,d,u){var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);})(window,document,'${bitrix.loaderUrl}');`;
    const observer=new MutationObserver(()=>{if(host.querySelector("form, iframe, .b24-form, .b24-form-wrapper")){host.querySelector(".bitrix-loading")?.remove();observer.disconnect();}});
    observer.observe(host,{childList:true,subtree:true});
    host.appendChild(embed);
    trackEvent("bitrix_form_loaded");
  }

  function setupAdhesionCopy() {
    const items=document.querySelectorAll(".adhesion-contact li");
    if(items[0])items[0].innerHTML="<i>✓</i> Atendente de IA";
  }

  document.addEventListener("click", event => {
    const link=event.target.closest("[data-link]"); if(link){event.preventDefault();navigate(link.getAttribute("href"));return;}
    const route=event.target.closest("[data-route]"); if(route){navigate(route.dataset.route);return;}
    if(event.target.closest("[data-contact]")){showContact("general");return;}
    if(event.target.closest("[data-calculator-contact]")){showContact("calculator");return;}
    if(event.target.closest("[data-allpfit]")){closeModals(false);showUnits();return;}
    if(event.target.closest("[data-general-contact]")){closeModals(false);navigate("/adesao");return;}
    const direct=event.target.closest("[data-direct-contact]");if(direct){openGeneralWhatsApp(direct.dataset.directContact);return;}
    if(event.target.closest("[data-close-modal]")){closeModals();return;}
    const state=event.target.closest("[data-state]");if(state){selectedState=state.dataset.state;renderStateFilters();renderUnits();return;}
    const unitButton=event.target.closest("[data-unit-index]");if(unitButton){const unit=config.allpfitUnits[Number(unitButton.dataset.unitIndex)];trackEvent("allpfit_unit_selected",{unit:unit.name,state:unit.uf});trackEvent("whatsapp_clicked",{origin:"allpfit",unit:unit.name});openExternal(unit.url);closeModals();return;}
    const accordion=event.target.closest(".accordion-trigger");if(accordion){const expanded=accordion.getAttribute("aria-expanded")==="true";accordion.setAttribute("aria-expanded",String(!expanded));document.getElementById(accordion.getAttribute("aria-controls")).hidden=expanded;return;}
    if(event.target.matches(".modal-backdrop"))closeModals();
    if(event.target.closest("[data-site-link]"))trackEvent("official_site_clicked");
  });
  unitSearch.addEventListener("input",renderUnits);
  document.addEventListener("keydown",event=>{
    const activeModal=!contactModal.hidden?contactModal:!unitsModal.hidden?unitsModal:null;
    if(event.key==="Escape"&&activeModal){closeModals();return;}
    if(event.key==="Tab"&&activeModal){const focusable=[...activeModal.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href]')];if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });
  window.addEventListener("popstate",()=>renderPage({focus:true}));
  window.addEventListener("scroll",()=>document.querySelector(".topbar").classList.toggle("scrolled",window.scrollY>18),{passive:true});
  document.querySelector("#year").textContent=new Date().getFullYear();
  renderPage();
  window.AlleConnect={createWhatsAppLink,trackEvent};
})();

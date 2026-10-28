/* Configuração central do Alle Connect. Altere contatos, desconto e conteúdo aqui. */
window.ALLE_CONFIG = Object.freeze({
  discountPercentage: 35,
  maxDiscountPercentage: 35,
  contacts: {
    generalWhatsApp: "5512953697411",
    officialSite: "https://alleenergia.com",
    bitrixForm: {
      code: "inline/100/wqeifh",
      loaderUrl: "https://cdn.bitrix24.com.br/b29334815/crm/form/loader_100.js"
    }
  },
  /* Cards de parceiros em "Encontre o que precisa". Sem url, o card aparece como "Em breve" e não abre nada. */
  partnerLinks: [
    { title: "Viva +", description: "Acesse o Viva +.", action: "Acessar", icon: "viva", url: "https://qrcode.allpfit.com.br/r/3zoj01s" },
    { title: "Super App", description: "Baixe o Super App.", action: "Abrir app", icon: "app", url: "" },
    { title: "Allp Home", description: "Conheça a Allp Home.", action: "Conhecer", icon: "home", url: "https://qrcode.allpfit.com.br/r/xkk3a8c" }
  ],
  energyCalculator: {
    /* As tarifas e o histórico de bandeiras ficam em energy-data.js (gerado por scripts/build-energy-data.py). */
    /* Adicional por kWh de cada bandeira tarifária (R$/kWh), conforme REH ANEEL nº 3.306/2024. */
    flags: [
      { id: "verde", name: "Verde (sem acréscimo)", short: "Verde", extra: 0 },
      { id: "amarela", name: "Amarela", short: "Amarela", extra: 0.01885 },
      { id: "vermelha1", name: "Vermelha patamar 1", short: "Vermelha 1", extra: 0.04463 },
      { id: "vermelha2", name: "Vermelha patamar 2", short: "Vermelha 2", extra: 0.07877 }
    ],
    /* Potência média de referência (W) e uso típico. Usados em "Consumo por aparelho". featured: aparece em "Aparelhos em destaque". */
    appliances: [
      { name: "Chuveiro elétrico 5.500 W", category: "Banheiro", power: 5500, hours: 0.5, days: 30, featured: true },
      { name: "Chuveiro elétrico 7.500 W", category: "Banheiro", power: 7500, hours: 0.5, days: 30, featured: true },
      { name: "Torneira elétrica", category: "Cozinha", power: 3500, hours: 0.15, days: 30, featured: true },
      { name: "Aquecedor de passagem elétrico", category: "Banheiro", power: 8000, hours: 0.5, days: 30, featured: true },
      { name: "Secador de cabelo", category: "Banheiro", power: 1500, hours: 0.25, days: 20 },
      { name: "Chapinha", category: "Banheiro", power: 200, hours: 0.5, days: 15 },
      { name: "Aquecedor de água (boiler)", category: "Banheiro", power: 3000, hours: 2, days: 30, featured: true },
      { name: "Geladeira frost free", category: "Cozinha", power: 60, hours: 24, days: 30 },
      { name: "Geladeira comum", category: "Cozinha", power: 45, hours: 24, days: 30 },
      { name: "Freezer horizontal", category: "Cozinha", power: 70, hours: 24, days: 30 },
      { name: "Micro-ondas", category: "Cozinha", power: 1200, hours: 0.25, days: 30 },
      { name: "Forno elétrico", category: "Cozinha", power: 1500, hours: 0.5, days: 12 },
      { name: "Air fryer", category: "Cozinha", power: 1500, hours: 0.5, days: 20 },
      { name: "Cafeteira elétrica", category: "Cozinha", power: 800, hours: 0.25, days: 30 },
      { name: "Liquidificador", category: "Cozinha", power: 400, hours: 0.1, days: 15 },
      { name: "Lava-louças", category: "Cozinha", power: 1500, hours: 1, days: 15 },
      { name: "Purificador de água", category: "Cozinha", power: 80, hours: 24, days: 30 },
      { name: "Cooktop de indução (1 boca)", category: "Cozinha", power: 2000, hours: 0.75, days: 30 },
      { name: "Ar-condicionado 9.000 BTU inverter", category: "Climatização", power: 650, hours: 8, days: 30 },
      { name: "Ar-condicionado 12.000 BTU inverter", category: "Climatização", power: 900, hours: 8, days: 30, featured: true },
      { name: "Ar-condicionado 18.000 BTU inverter", category: "Climatização", power: 1400, hours: 8, days: 30 },
      { name: "Ar-condicionado 12.000 BTU convencional", category: "Climatização", power: 1200, hours: 8, days: 30 },
      { name: "Ventilador de teto", category: "Climatização", power: 120, hours: 8, days: 30 },
      { name: "Ventilador de mesa", category: "Climatização", power: 65, hours: 8, days: 30 },
      { name: "Aquecedor elétrico", category: "Climatização", power: 1500, hours: 4, days: 30 },
      { name: "Aquecedor a óleo", category: "Climatização", power: 1500, hours: 6, days: 30, featured: true },
      { name: "Máquina de lavar roupa", category: "Lavanderia", power: 500, hours: 1, days: 12 },
      { name: "Secadora de roupa", category: "Lavanderia", power: 3000, hours: 1, days: 8 },
      { name: "Ferro de passar", category: "Lavanderia", power: 1000, hours: 1, days: 8 },
      { name: "TV LED 43\"", category: "Entretenimento", power: 70, hours: 5, days: 30 },
      { name: "TV LED 55\"", category: "Entretenimento", power: 110, hours: 5, days: 30 },
      { name: "Videogame", category: "Entretenimento", power: 150, hours: 3, days: 30 },
      { name: "Som / caixa de som", category: "Entretenimento", power: 50, hours: 3, days: 30 },
      { name: "Computador gamer", category: "Escritório", power: 450, hours: 4, days: 30 },
      { name: "Computador de mesa", category: "Escritório", power: 200, hours: 8, days: 22 },
      { name: "Notebook", category: "Escritório", power: 65, hours: 8, days: 22 },
      { name: "Monitor", category: "Escritório", power: 30, hours: 8, days: 22 },
      { name: "Impressora", category: "Escritório", power: 30, hours: 0.5, days: 10 },
      { name: "Roteador Wi-Fi", category: "Escritório", power: 12, hours: 24, days: 30 },
      { name: "Carregador de celular", category: "Escritório", power: 20, hours: 2, days: 30 },
      { name: "Lâmpada LED 9 W", category: "Iluminação", power: 9, hours: 6, days: 30 },
      { name: "Lâmpada fluorescente 20 W", category: "Iluminação", power: 20, hours: 6, days: 30 },
      { name: "Lâmpada incandescente 60 W", category: "Iluminação", power: 60, hours: 6, days: 30 },
      { name: "Bomba de piscina 1/2 cv", category: "Área externa", power: 750, hours: 6, days: 30 },
      { name: "Bomba d'água 1/2 cv", category: "Área externa", power: 750, hours: 0.5, days: 30 },
      { name: "Portão eletrônico", category: "Área externa", power: 300, hours: 0.1, days: 30, featured: true },
      { name: "Carro elétrico (carregador 7 kW)", category: "Área externa", power: 7000, hours: 1, days: 30, featured: true }
    ],
    /* Faixas de consumo mensal exibidas em "Quanto custa". */
    consumptionLevels: [30, 50, 100, 150, 200, 250, 300, 400, 500, 750, 1000],
    /* Premissas do simulador solar. Ajuste o custo médio do kWp instalado conforme o mercado. */
    solar: { costPerKwp: 4000, performanceRatio: 0.8, panelWatts: 550 }
  },
  messages: {
    general: "Olá! Vim pelo Alle Connect e gostaria de falar com a equipe Alle Energia.",
    calculator: "Olá! Fiz uma simulação no Alle Connect e gostaria de saber mais sobre como economizar na minha conta de energia."
  },
  institutional: {
    title: "Energia mais simples, econômica e conectada.",
    description: "A Alle Energia conecta você a uma forma digital e inteligente de consumir energia, combinando economia, tecnologia e liberdade para escolher."
  },
  faq: [
    { question: "Quem pode ser cliente da Alle Energia?", answer: "Pessoas físicas e jurídicas que sejam titulares de uma conta de energia, seja residencial, comercial, rural, em imóvel próprio ou alugado, com um consumo superior a R$ 200,00." },
    { question: "Já sou cliente e fiquei sem energia. O que faço?", answer: "A qualidade e a responsabilidade pela entrega de energia continuam sendo da distribuidora, mas a Alle Energia intermedia a comunicação com a distribuidora em seu nome. A Alle Energia oferece atendimento com inteligência artificial, todos os dias, e tem prioridade junto à distribuidora devido à quantidade de unidades consumidoras sob sua titularidade. Você pode entrar em contato com a Alle por ligação ou WhatsApp pelo número disponível em nossos canais de atendimento." },
    { question: "Posso sair da Alle Energia quando quiser?", answer: "Sim. O cliente pode solicitar a saída da Alle Energia a qualquer momento. No entanto, é importante comunicar sua decisão com antecedência, pois a distribuidora de energia exige um prazo de até 60 dias para concluir o processo de desligamento da associação. Durante esse período, o fornecimento e a cobrança de energia continuam normalmente até a finalização da saída." },
    { question: "Quando vou receber minha primeira fatura de energia da Alle Energia?", answer: "Após a troca de titularidade, a primeira fatura pode ser emitida entre 30 e 45 dias após a primeira leitura do medidor, conforme o ciclo de medição da distribuidora. Durante esse período, o fornecimento de energia continua normalmente. Assim que a fatura estiver disponível, ela será enviada por e-mail, WhatsApp e também ficará acessível pelo portal do cliente." },
    { question: "O que acontece se eu atrasar ou deixar de pagar a fatura?", answer: "Caso o cliente fique inadimplente, a Associação poderá realizar a devolução do contrato para a distribuidora, conforme previsto nas regras do termo de adesão. Durante esse processo, o fornecimento de energia não é interrompido, mas o cliente volta a ser faturado diretamente pela distribuidora local." },
    { question: "O que é a fatura pró-rata e por que posso recebê-la ao trocar a titularidade?", answer: "A fatura pró-rata é uma fatura com valor proporcional aos dias de consumo entre a última leitura e a data em que foi feita a troca de titularidade. Por isso, é possível que você receba uma fatura com valor menor, já que ela corresponde a poucos dias de consumo antes da mudança de titularidade." },
    { question: "Recebi uma fatura da distribuidora em nome da associação. Devo pagar?", answer: "Não. Caso a distribuidora envie por engano uma fatura em nome da associação, não realize o pagamento. Você deve pagar somente o boleto que estiver em seu nome. Em caso de dúvida, entre em contato conosco — a Alle Energia pode enviar um modelo de boleto correto para que você identifique facilmente qual é o documento válido para pagamento." },
    { question: "Paguei um boleto em duplicidade. O que devo fazer?", answer: "Fique tranquilo! Caso ocorra o pagamento em duplicidade, a associação realiza o reembolso do valor pago indevidamente. Esse tipo de situação pode acontecer se, por engano, você pagar um boleto emitido em nome da associação. Por isso, lembre-se: pague apenas o boleto que estiver em seu nome. O reembolso é realizado em até 30 dias após a confirmação do pagamento duplicado." },
    { question: "Onde posso emitir meu boleto com desconto?", answer: "Após a adesão, o cliente recebe por e-mail cadastrado um login e senha para acessar a plataforma da associação. Na área do cliente, é possível emitir o boleto com desconto e também consultar o boleto original emitido pela distribuidora, reforçando o nosso compromisso com a transparência e a entrega da economia garantida. Caso tenha qualquer dificuldade para acessar a plataforma, entre em contato com a equipe da Alle Energia pelos canais de atendimento." }
  ],
  allpfitUnits: [
    { uf:"AL", name:"Maceió", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/p3c4juy" },
    { uf:"BA", name:"Caminho de Areia - Salvador", url:"https://qrcode.allpfit.com.br/r/l3e31ox" },
    { uf:"BA", name:"Ilhéus", url:"https://qrcode.allpfit.com.br/r/r2k2a2f" },
    { uf:"BA", name:"Itabuna", url:"https://qrcode.allpfit.com.br/r/xgsg2j7" },
    { uf:"BA", name:"Itabuna II", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/fj9twqf" },
    { uf:"BA", name:"Jequié", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/acp7bma" },
    { uf:"BA", name:"Lauro de Freitas", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/eqxkjtg" },
    { uf:"BA", name:"Pernambués - Salvador", url:"https://qrcode.allpfit.com.br/r/nsywcfg" },
    { uf:"BA", name:"Vitória da Conquista", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/mkt3wbe" },
    { uf:"CE", name:"Maracanaú", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/pvrb9kn" },
    { uf:"CE", name:"Maranguape", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/naqso45" },
    { uf:"ES", name:"Glória - Vila Velha", url:"https://qrcode.allpfit.com.br/r/zx7xaha" },
    { uf:"ES", name:"Guriri", url:"https://qrcode.allpfit.com.br/r/awcmovc" },
    { uf:"ES", name:"São Mateus", url:"https://qrcode.allpfit.com.br/r/zdjpjfi" },
    { uf:"ES", name:"Vila Velha", url:"https://qrcode.allpfit.com.br/r/gskncko" },
    { uf:"GO", name:"Goiânia", url:"https://qrcode.allpfit.com.br/r/5bj1wwr" },
    { uf:"MG", name:"Canaã", url:"https://qrcode.allpfit.com.br/r/uvasbz6" },
    { uf:"MG", name:"Caratinga", url:"https://qrcode.allpfit.com.br/r/0vu4xqn" },
    { uf:"MG", name:"Cidade Nova", url:"https://qrcode.allpfit.com.br/r/579fu3n" },
    { uf:"MG", name:"Coronel Fabriciano", url:"https://qrcode.allpfit.com.br/r/9mn3ba5" },
    { uf:"MG", name:"Cristiano Machado I", url:"https://qrcode.allpfit.com.br/r/j2unbim" },
    { uf:"MG", name:"Cristiano Machado II", url:"https://qrcode.allpfit.com.br/r/t6isydd" },
    { uf:"MG", name:"Guarani", url:"https://qrcode.allpfit.com.br/r/wjpnfn2" },
    { uf:"MG", name:"Ipatinga Bom Jardim", url:"https://qrcode.allpfit.com.br/r/ckupqxr" },
    { uf:"MG", name:"Ipatinga Cidade Nobre", url:"https://qrcode.allpfit.com.br/r/x7y9jgc" },
    { uf:"MG", name:"Ipatinga Shopping Vale do Aço", url:"https://qrcode.allpfit.com.br/r/1oojg6n" },
    { uf:"MG", name:"Juiz de Fora", url:"https://qrcode.allpfit.com.br/r/27ttczj" },
    { uf:"MG", name:"Pouso Alegre", url:"https://qrcode.allpfit.com.br/r/51m2v38" },
    { uf:"MG", name:"Silveira - BH", url:"https://qrcode.allpfit.com.br/r/rcojilv" },
    { uf:"MG", name:"Timóteo", url:"https://qrcode.allpfit.com.br/r/s2bgtun" },
    { uf:"MG", name:"Tirol - BH", url:"https://qrcode.allpfit.com.br/r/6fnzek8" },
    { uf:"MG", name:"Uberlândia", url:"https://qrcode.allpfit.com.br/r/f4qo1k5" },
    { uf:"MG", name:"Venda Nova", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/xbw0e72" },
    { uf:"MS", name:"Campo Grande", url:"https://qrcode.allpfit.com.br/r/pdtol2p" },
    { uf:"PA", name:"Ananindeua", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/z3i6e5j" },
    { uf:"PB", name:"Campina Grande", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/29bzhln" },
    { uf:"PB", name:"João Pessoa", url:"https://qrcode.allpfit.com.br/r/88d50xq" },
    { uf:"PR", name:"Apucarana", url:"https://qrcode.allpfit.com.br/r/hddmwgi" },
    { uf:"PR", name:"Londrina", url:"https://qrcode.allpfit.com.br/r/etl9j3o" },
    { uf:"RJ", name:"Jacarepaguá", url:"https://qrcode.allpfit.com.br/r/71nhsni" },
    { uf:"RN", name:"Natal (Capim Macio)", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/3eqafqq" },
    { uf:"SC", name:"Joinville", url:"https://qrcode.allpfit.com.br/r/ep7tyq6" },
    { uf:"SP", name:"Americana", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/6e78dgo" },
    { uf:"SP", name:"Bauru", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/p3gaqhb" },
    { uf:"SP", name:"Franca", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/qed7bsm" },
    { uf:"SP", name:"Ribeirão Preto", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/m0z7zxe" },
    { uf:"SP", name:"São José do Rio Preto", url:"https://xbzavxqsdndytfokdqzi.supabase.co/functions/v1/qr-redirect/gp8olxa" }
  ]
});

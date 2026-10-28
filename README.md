# Alle Connect

Portal estático e mobile-first da Alle Energia. Não requer etapa de build nem dependências JavaScript.

## Executar

Abra com um servidor HTTP que ofereça fallback para `index.html`, ou use Docker:

```sh
docker build -t alle-connect .
docker run --rm -p 8080:80 alle-connect
```

## Configuração

As configurações ficam em `config.js`:

- `discountPercentage`: percentual usado na calculadora;
- `contacts.generalWhatsApp`: contato geral em formato internacional, somente números;
- `contacts.officialSite`: site oficial;
- `allpfitUnits`: unidades e URLs já vinculadas;
- `faq` e `institutional`: conteúdo editável.

Para adicionar uma unidade, inclua em `allpfitUnits` um objeto no formato:

```js
{ uf: "RN", name: "Nome da unidade", url: "URL oficial de atendimento" }
```

## Rotas

- `/`: dashboard;
- `/calculadora`: simulação de economia;
- `/calcule-sua-energia`: calculadora de consumo e ferramentas gratuitas;
- `/ferramentas/tarifas`, `/ferramentas/consumo-aparelhos`, `/ferramentas/quanto-custa`, `/ferramentas/bandeira`, `/ferramentas/solar`, `/ferramentas/estados`: ferramentas de energia;
- `/cliente`: serviços para clientes;
- `/duvidas`: FAQ;
- `/conheca`: conteúdo institucional.

## Dados de energia

`energy-data.js` (tarifas e bandeiras da ANEEL, irradiação solar da NASA POWER) é gerado por script. Para atualizar:

```sh
python3 scripts/build-energy-data.py
```

O script baixa os dados abertos (o CSV de tarifas tem cerca de 180 MB) para `.energy-cache/`. Depois de rodar, troque o `?v=` dos arquivos no `index.html` e gere a imagem de novo. Distribuidoras novas precisam ser incluídas em `NAMES`, no script. Aparelhos, valores das bandeiras e premissas do simulador solar ficam em `config.js` (`energyCalculator`).

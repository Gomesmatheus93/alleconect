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
- `/cliente`: serviços para clientes;
- `/duvidas`: FAQ;
- `/conheca`: conteúdo institucional.

# coronabr-api

API de acompanhamento de casos do COVID-19 no Brasil

## Fontes

### Our World in Data

Para este projeto, é o dado oficial para análise dos casos do COVID-19. Após o dia 18 de Marco de 2020, estamos considerando estes casos devido ao fato da plataforma oficial do Governo não disponibilizar mais o website. Não deixe conferir o link oficial do [Our World in Data - Coronavirus Source Data](https://ourworldindata.org/coronavirus-source-data).

Portanto, os dados na pasta `data/ivis` estão desatualizados.

---

## Instruções para execução local

Antes de mais nada, é necessário configurar as variáveis de ambiente. Para isso, copie e cole o conteúdo de `.env.sample` para um arquivo `.env`.

### Executando o parser

Na pasta `parser`, há o parser responsável por pegar os dados da API do Ministério da Saúde e transformar em JSON. Para executar o parser:

```sh
yarn parser # npm run parser
```

### Subindo o servidor Fastify

Para subir o servidor com o Fastify, execute:

```sh
yarn dev # npm run dev
```

Após isso, a API estará disponível em [http://localhost:3000](http://localhost:3000).

## API

### / -> index route

Retorna a versão da API e mais algumas informações:

```json
{
  "version": "1.0.0",
  "up": true
}
```

### /period -> rota dos estados

Retorna uma lista com os números de casos e mortes por dia no Brasil. Um exemplo de JSON de resposta:

```json
{
  "error": false,
  "timestamp": 1587774879474,
  "data": {
    "dates": [
      {
        "date": "2020-03-01",
        "new_cases": 1,
        "new_deaths": 0,
        "cases": 2,
        "deaths": 0
      },
      {
        "date": "2020-03-02",
        "new_cases": 0,
        "new_deaths": 0,
        "cases": 2,
        "deaths": 0
      }
    ],
    "lastUpdated": 1587724986055
  }
}
```

Aceita como querystring os seguintes campos para filtrar por dia:

- **from**: desde quando se quer trazer os dados
- **to**: até quando se quer trazer os dados

Sendo assim, no exemplo de requisição `/period?from=2020-03-07&to=2020-03-17`, o objetivo é trazer os dados do dia 07 de Março até 17 de Março.

Se não for passado nenhum período, toda a série histórica será retornada

### /today -> rota que mostra as estatísticas para hoje

Retorna o dado da rota `/states`, mas apenas para o último dia de dado avaliado.

```json
{
  "error": false,
  "timestamp": 1584501283740,
  "data": {
    "today": {
      "date": "2020-03-17",
      "time": "18:10",
      "fullDate": "2020-03-17 18:10:00",
      "values": [],
      "accumulated": {
        "suspects": 17638,
        "refuses": 1890,
        "cases": 291,
        "deaths": 1
      }
    },
    "lastUpdated": 1584499854241
  }
}
```

---

## Autor

Emanuel Gonçalves

- Twitter [@emanuelgsouza](https://twitter.com/emanuelgsouza)
- Github [@emanuelgsouza](https://github.com/emanuelgsouza)

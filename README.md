# coronabr-api

API de acompanhamento de casos do COVID-19 no Brasil

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

### /states -> rota dos estados

Retorna uma lista com as datas de análise e para cada data, os valores por Estado da Federação e os valores acumulados

```json
{
  "error": false,
  "timestamp": 1584501283740,
  "data": {
    "values": [
      {
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
      }
    ],
    "lastUpdated": 1584499854241
  }
}
```

No campo `values`, por data, está os valores dos campos em `accumulated` discriminado por Estado. Lembrand que todo Estado terá os campos preenchidos.

Aceita como querystring os seguintes campos para filtrar por dia:

* **from**: desde quando se quer trazer os dados
* **to**: até quando se quer trazer os dados

Sendo assim, no exemplo de requisição `/states?from=2020-03-07&to=2020-03-17`, o objetivo é trazer os dados do dia 07 de Março até 17 de Março.

### /today -> rota que mostra as estatísticas para hoje

Retorna o dado da rota `/states`, mas apenas para o último dia de dado avaliado.

```json
{
  "error": false,
  "timestamp": 1584501283740,
  "data": {
    "values": [
      {
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
      }
    ],
    "lastUpdated": 1584499854241
  }
}
```

---

## Autor

Emanuel Gonçalves

- Twitter [@emanuelgsouza](https://twitter.com/emanuelgsouza)
- Github [@emanuelgsouza](https://github.com/emanuelgsouza)

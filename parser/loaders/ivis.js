require('dotenv').config()
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { omit } = require('lodash')

const STATES_UIDS = require('../../data/ivis/states-uids.json')

const loadExternalData = async () => {
  const lastUpdated = Date.now()
  try {
    const URL = `${process.env.DATABASES_URL}?v=${lastUpdated}`
    const response = await axios.get(URL)
    const responseData = response.data || ''
    const replaceString = 'var database='
    if (responseData) {
      return Promise.resolve(JSON.parse(responseData.replace(replaceString, '')))
    }

    console.error('Não foi possível capturar nenhum dado do sistema do Ministério da Saúde')
    process.exit(0)
  } catch (e) {
    console.error('Houve um erro na busca dos dados')
    return Promise.reject(new Error(e.message))
  }
}

const getPath = filePath => path.join(__dirname, `../data/${filePath}`)

const factoryDataToSave = (location, data, lastUpdated) => {
  return JSON.stringify({
    location,
    data,
    lastUpdated
  })
}

const saveDataToJSON = (statesData, brazilianData) => {
  console.log('Saving brazilian data')

  try {
    const lastUpdated = Date.now()
    fs.writeFileSync(
      getPath('brazil.json'),
      factoryDataToSave('brazil', brazilianData, lastUpdated)
    )

    Object.values(statesData).forEach(state => {
      const name = `states/${state.state}.json`
      fs.writeFileSync(
        getPath(name), factoryDataToSave(state.state, state, lastUpdated)
      )
    })

    return Promise.resolve(true)
  } catch (e) {
    console.error('Houve um erro no armazenamento dos dados')
    return Promise.reject(new Error(e.message))
  }
}

const toPlainData = (rawData = []) => {
  return rawData.reduce((acc, data) => {
    const { values, date, time } = data
    const [day, month, year] = date.split('/')

    return [
      ...acc,
      ...values.map(stateData => {
        return {
          ...stateData,
          date: `${year}-${month}-${day}`,
          time,
          fullDate: `${year}-${month}-${day} ${time}:00`,
          state: STATES_UIDS[stateData.uid]
        }
      })
    ]
  }, [])
}

const processDataToStates = (plainData = []) => {
  return plainData.reduce((acc, item) => {
    const data = omit(item, ['state'])

    if (acc[item.state]) {
      acc[item.state].dates.push(data)
    } else {
      acc[item.state] = {
        state: item.state,
        dates: [data]
      }
    }

    return acc
  }, {})
}

const processDataToBrasil = (plainData = []) => {
  const datesData = plainData.reduce((acc, item) => {
    if (acc[item.date]) {
      acc[item.date].values.push(item)
    } else {
      const { date, time, fullDate } = item

      acc[item.date] = {
        date,
        time,
        fullDate,
        values: [item]
      }
    }

    return acc
  }, {})

  return Object.values(datesData).map(item => {
    const { date, time, fullDate, values } = item

    return {
      date,
      time,
      fullDate,
      accumulated: values.reduce((acc, data) => {
        acc['suspects'] += data.suspects || 0
        acc['refuses'] += data.refuses || 0
        acc['cases'] += data.cases || 0
        acc['suspects'] += data.suspects || 0
        acc['deaths'] += data.deaths || 0

        return acc
      }, {
        suspects: 0,
        refuses: 0,
        cases: 0,
        suspects: 0,
        deaths: 0
      })
    }
  })
}

const parserFromIvis = async () => {
  try {
    console.log('Buscando os dados da plataforma do IVIS - Ministério da Saúde...')
    const rawData = await loadExternalData()
    const plainData = toPlainData(rawData.brazil)
    const statesData = processDataToStates(plainData)
    const brazilianData = processDataToBrasil(plainData)
    
    await saveDataToJSON(statesData, brazilianData)
    console.log('Dados salvos...')
    process.exit(0)
  } catch (e) {
    console.error('Houve um erro no processamento dos dados')
    console.error(e)
    process.exit(1)
  }
}

module.exports = {
  parserFromIvis
}
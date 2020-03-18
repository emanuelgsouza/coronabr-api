require('dotenv').config()
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const lastUpdated = Date.now()
const STATES_UIDS = require('../data/states-uids.json')

const getData = async () => {
  try {
    const URL = `${process.env.DATABASES_URL}?v=${lastUpdated}`
    const response = await axios.get(URL)
    const responseData = response.data || ''
    const replaceString = 'var database='
    return Promise.resolve(JSON.parse(responseData.replace(replaceString, '')))
  } catch (e) {
    console.error('Houve um erro na busca dos dados')
    return Promise.reject(new Error(e.message))
  }
}

const getPath = filePath => path.join(__dirname, `../data/${filePath}`)

const getDataToSave = (locationType, data, lastUpdated) => {
  return JSON.stringify({
    locationType,
    data,
    lastUpdated
  })
}

const processData = data => {
  return data.map(item => {
    const { date, time } = item
    const [day, month, year] = date.split('/')

    return {
      date: `${year}-${month}-${day}`,
      time,
      fullDate: `${year}-${month}-${day} ${time}:00`,
      values: item.values.map(stateData => {
        return {
          ...stateData,
          state: STATES_UIDS[stateData.uid]
        }
      }),
      accumulated: item.values.reduce((acc, data) => {
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

const saveData = (data) => {
  const FILES = {
    BR: 'data-br.json',
    WORLD: 'data-world.json'
  }

  console.log('Saving brazilian data')

  try {
    const lastUpdated = Date.now()
    fs.writeFileSync(
      getPath(FILES.BR), getDataToSave('brazil', processData(data.brazil), lastUpdated)
    )

    fs.writeFileSync(
      getPath(FILES.WORLD), getDataToSave('world', data.world, lastUpdated)
    )

    return Promise.resolve(true)
  } catch (e) {
    console.error('Houve um erro no armazenamento dos dados')
    return Promise.reject(new Error(e.message))
  }
}

const parser = async () => {
  try {
    console.log('Buscando os dados...')
    const data = await getData()
    await saveData(data)
    console.log('Dados salvos...')
    process.exit(0)
  } catch (e) {
    console.error('Houve um erro no processamento dos dados')
    console.error(e)
    process.exit(1)
  }
}

parser()

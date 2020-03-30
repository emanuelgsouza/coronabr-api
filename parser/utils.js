const fs = require('fs')
const path = require('path')

const brazilDataPath = path.join(__dirname, '../data/brazil.json')

const checkIsDateUpdated = (externalResults = []) => {
  console.log('- Verificando se dados locais já existem')

  if (fs.existsSync(brazilDataPath)) {
    console.log('--- Dados locais existem, verificando se são atuais')
    const brazilData = require(brazilDataPath)
    const { date } = getLastData(brazilData.data)
    const { date: externalDate } = getLastData(externalResults)
    return new Date(date) >= new Date(externalDate)
  }

  console.log('--- Dados locais não existem')
  return false
}

const getLastData = (results = []) => {
  const sorted = [ ...results ].sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })

  return sorted[0]
}

module.exports = {
  checkIsDateUpdated,
  getLastData
}
const fs = require('fs')
const path = require('path')

// const { parserFromIvis } = require('./loaders/ivis')
const { parserFromOWD } = require('./loaders/owd')
const { checkIsDateUpdated } = require('./utils')

const factoryOWDDataToSave = (location = '', data = []) => {
  const lastUpdated = Date.now()

  return JSON.stringify({
    location,
    data,
    lastUpdated
  })
}

const parser = async () => {
  console.log('- Iniciando parser')

  try {
    const externalData = await parserFromOWD('Brazil')
    if (checkIsDateUpdated(externalData)) {
      console.log('- JSON local já está atualizado')
      return
    }

    console.log('- Dados atuais estão desatualizados, salvando dados mais atuais')
    const dataToSave = factoryOWDDataToSave('brazil', externalData)
    fs.writeFileSync(path.join(__dirname, '../data/brazil.json'), dataToSave)
    console.log('- Dados salvos com sucesso')
  } catch (e) {
    console.error(e.message)
  }
}

parser()

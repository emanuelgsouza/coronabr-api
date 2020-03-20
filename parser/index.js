const fs = require('fs')
const path = require('path')

// const { parserFromIvis } = require('./loaders/ivis')
const { parserFromOWD } = require('./loaders/owd')

const factoryOWDDataToSave = (location = '', data = []) => {
  const lastUpdated = Date.now()

  return JSON.stringify({
    location,
    data,
    lastUpdated
  })
}

const parser = async () => {
  try {
    const owdData = await parserFromOWD('Brazil')

    const dataToSave = factoryOWDDataToSave('brazil', owdData)

    fs.writeFileSync(path.join(__dirname, '../data/brazil.json'), dataToSave)
  } catch (e) {
    console.error(e.message)
  }
}

parser()

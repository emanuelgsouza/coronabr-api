require('dotenv').config()
const pkg = require('./package.json')
const brData = require('./data/brazil.json')

const getDataFromRange = (values, to, from) => {
  const toTimestamp = new Date(to).getTime()
  const fromTimestamp = new Date(from).getTime()

  return values.reduce((acc, item) => {
    const currentTimestamp = new Date(item.date).getTime()

    if (currentTimestamp >= fromTimestamp && currentTimestamp <= toTimestamp) {
      acc.push(item)
    }

    return acc
  }, [])
}

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.get('/', async () => {
  return {
    version: pkg.version,
    up: true
  }
})

fastify.get('/today', async () => {
  return {
    error: false,
    timestamp: Date.now(),
    data: {
      today: { ...brData.data[brData.data.length - 1] },
      lastUpdated: brData.lastUpdated
    }
  }
})

fastify.get('/period', async (request) => {
  const { query = {} } = request
  const { to, from } = query

  if (!to || !from) {
    return {
      error: false,
      timestamp: Date.now(),
      data: {
        dates: brData.data,
        lastUpdated: brData.lastUpdated
      }
    }
  }

  return {
    error: false,
    timestamp: Date.now(),
    data: {
      dates: getDataFromRange(brData.data, to, from),
      lastUpdated: brData.lastUpdated
    }
  }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
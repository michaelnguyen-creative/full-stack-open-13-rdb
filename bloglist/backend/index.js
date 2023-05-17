const http = require('http')

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { testConnectionPostgres } = require('./postgres/init')
const connectToMongo = require('./mongo/init')

const server = http.createServer(app)

testConnectionPostgres()
connectToMongo()

server.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`)
})

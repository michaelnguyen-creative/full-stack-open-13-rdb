const http = require('http')

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { connectToMongo } = require('./mongo/init')
const { connectToPostgres } = require('./postgres/init')

const server = http.createServer(app)

connectToPostgres()
connectToMongo()

server.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`)
})

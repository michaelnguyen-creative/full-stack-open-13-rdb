const http = require('http')

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const sequelize = require('./postgres/init')

const server = http.createServer(app)

sequelize
  .authenticate()
  .then(() => console.log('Established connection to Postgres at', config.DATABASE_URL))
  .catch((error) => {
    console.log('Postgres connection errror:', error.message)
  })

server.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`)
})

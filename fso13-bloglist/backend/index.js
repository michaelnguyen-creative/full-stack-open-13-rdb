const http = require('http')
const app = require('./app')
const config = require('./utils/config')
const { connectToPostgres } = require('./utils/connectPostgres')

const server = http.createServer(app)

const startServer = async () => {
  await connectToPostgres()
  server.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
  })
}

startServer()

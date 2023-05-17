const { Sequelize } = require('sequelize')
const config = require('../utils/config')

const sequelize = new Sequelize(config.DATABASE_URL)

const testConnectionPostgres = async () => {
  try {
    sequelize.authenticate()
    console.log('Established connection to Postgres at', config.DATABASE_URL)
    console.log("Synchronizing Postgres models")
    await sequelize.sync()
  } catch (error) {
    console.log('Postgres connection errror:', error.message)
    return process.exit(1)
  }
}

module.exports = { sequelize, testConnectionPostgres }

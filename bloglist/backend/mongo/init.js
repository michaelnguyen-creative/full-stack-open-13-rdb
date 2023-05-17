const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')

const connectToMongo = async () => {
  try {
    mongoose.connect(config.MONGODB_URI)
    logger.info('connected to MongoDB at', config.MONGODB_URI)
  } catch (error) {
    logger.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

module.exports = { connectToMongo }
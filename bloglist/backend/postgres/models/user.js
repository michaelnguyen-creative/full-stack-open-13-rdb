const {sequelize } = require('../init')
const { DataTypes } = require('sequelize')

module.exports = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})
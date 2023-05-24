const { sequelize } = require('../init')
const { DataTypes, Model } = require('sequelize')

class Blog extends Model {}

module.exports = Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'Blog'
})
// module.exports = sequelize.define('Blog', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   author: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   url: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   title: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   likes: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0,
//   },
// })
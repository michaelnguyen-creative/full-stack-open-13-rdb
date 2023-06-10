const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/connectPostgres");

class ReadingList extends Model {}

module.exports = ReadingList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "readinglist",
  }
);

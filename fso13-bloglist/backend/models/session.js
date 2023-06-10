// Session model init, class syntax with sequelize
const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../utils/connectPostgres");

class Session extends Model {}

// export module
module.exports = Session.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: "session",
    timestamps: false,
  }
);

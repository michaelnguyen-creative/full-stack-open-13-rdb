// sequelize migration file
const { DataTypes } = require("sequelize");

// add a new table called sessions
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("sessions", {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      // userId references the id column in the users table
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
    // add a session_id as foreign key to the users table
    await queryInterface.addColumn("users", "session_id", {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: "sessions",
        key: "id",
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("sessions");
    await queryInterface.removeColumn("users", "session_id");
  },
};

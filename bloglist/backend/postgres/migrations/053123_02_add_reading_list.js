const { DataTypes } = require('sequelize');

module.exports = {
    up: async ({ context: queryInterface }) => {
        // Create a new reading_list table
        await queryInterface.createTable('reading_list', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            read: {
                allowNull: false,
                defaultValue: false,
                type: DataTypes.BOOLEAN
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            blog_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'blogs',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false
            }
        });
    },

    down: async ({ context: queryInterface }) => {
        // Remove the reading_list table
        await queryInterface.dropTable('reading_list');
    }
};
const { DataTypes } = require('sequelize');

module.exports = {
    up: async ({ context: queryInterface }) => {
        // Add a new field to the Blogs table
        await queryInterface.addColumn('blogs', 'read', {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN
        });

        // Create a new reading_list table
        await queryInterface.createTable('reading_list', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            blogId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Blogs',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        });
    },

    down: async ({ context: queryInterface }) => {
        // Remove the reading_list table
        await queryInterface.dropTable('reading_list');

        // Remove the read field from the Blogs table
        await queryInterface.removeColumn('blogs', 'read');
    }
};
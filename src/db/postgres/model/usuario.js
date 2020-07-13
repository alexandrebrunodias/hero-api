const Sequelize = require('sequelize');


const Usuario = {
    name: 'usuarios',
    table: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            required: true,
            autoIncrement: true,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            required: true,
        },
        password: {
            type: Sequelize.STRING,
            required: true
        }
    },
    options: {
        tableName: 'USUARIOS',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = Usuario
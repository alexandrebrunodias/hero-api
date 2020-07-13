const Sequelize = require('sequelize');

const Heroi = {
    name: 'herois',
    table: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true,
        },
        poder: {
            type: Sequelize.STRING,
            required: true,
        },
    },
    options: {
        tableName: 'HEROIS',
        freezeTableName: false,
        timestamps: false
    }
};

module.exports = Heroi;

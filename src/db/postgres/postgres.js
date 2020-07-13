const Crud = require('../crud');
const Sequelize = require('sequelize');

class Postgres extends Crud {
    constructor(connection, model) {
        super();
        this._connection = connection;
        this._model = model;
    }

    async create(item) {
        const { dataValues } = await this._model.create(item);
        return dataValues;
    }

    read(where = {}) {
        //Pode ser usado findByPk
        return this._model.findAll({ where: where, raw: true });
    }

    update(id, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update';
        return this._model[fn](item, { where: { id } });
    }

    delete(id) {
        return this._model.destroy({ where: { id } });
    }

    deleteWithoutWhere() {
        return this._model.destroy({ where: {} });
    }

    static connect() {
        return new Sequelize(process.env.POSTGRES_URL, {
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorAliases: false,
                logging: false,
                ssl: process.env.SSL_DB,
                dialectOptions: {
                    ssl: process.env.SSL_DB,
                }
            });
    }

    static async defineModel(connection, model) {
        const table = connection.define(model.name, model.table, model.options);
        await table.sync()
        return table;
    }

    async isConnected() {
        try {
            await this._connection.authenticate();
            return true;
        } catch (e) {
            console.log('Falha ao se conectar no Postgres', e);
            return false;
        }
    }
}

module.exports = Postgres;
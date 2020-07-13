const Crud = require('../crud');
const Mongoose = require('mongoose')

const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando'
};

class MongoDB extends Crud {
    constructor(connection, schema) {
        super();
        this._connection = connection;
        this._schema = schema;
    }

    create(item) {
        return this._schema.create(item);
    }

    read(query = {}, skip = 0, limit = 10) {
        return this._schema.find(query).skip(skip).limit(limit);
    }

    update(id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item });
    }

    delete(id) {
        return this._schema.deleteOne({ _id: id });
    }

    deleteWithoutWhere() {
        return this._schema.deleteMany({});
    }

    static connect() {
        Mongoose.connect("mongodb://alex:alex@localhost:27017/herois",
            { useNewUrlParser: true, useUnifiedTopology: true }, error => {
                if (!error) return;
                console.log('Deu águia', error);
            });
        Mongoose.connection.once('open', () => console.log("Connected with MongoDB"));

        return Mongoose.connection;
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState];

        if (state === 'Conectado') return state;
        if (state !== 'Conectando') return state;

        await new Promise(resolve => setTimeout(resolve, 1000));

        return STATUS[this._connection.readyState];
    }
}

module.exports = MongoDB;
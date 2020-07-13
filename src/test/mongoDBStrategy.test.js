const assert = require('assert');
const DBStrategy = require('../db/databaseStrategy');
const MongoDB = require('../db/mongodb/mongodb');
const HeroiSchema = require('../db/mongodb/schemas/heroiSchema')

const DEFAULT_ITEM_CADASTRAR = {
    nome: "Ronaldinho",
    poder: "Dibre"
}

const DEFAULT_ITEM_ATUALIZAR = {
    nome: "Messi",
    poder: "Melhor do mundo"
}

let mongo = null;
let MOCK_HEROI_ID = '';

describe('Suite de testes MongoDB', function () {
    this.beforeAll(async () => {
        const connetion = MongoDB.connect();
        mongo = new DBStrategy(new MongoDB(connetion, HeroiSchema));
        // await mongo.deleteWithoutWhere();
        MOCK_HEROI_ID = await mongo.create(DEFAULT_ITEM_ATUALIZAR);
    });

    this.afterAll(async () => {
        // await mongo.deleteWithoutWhere();
    });

    it('Deve verificar a conexão', async () => {
        const expected = 'Conectado';
        const actual = await mongo.isConnected();

        assert.deepStrictEqual(actual, expected);
    });

    it('Deve cadastrar', async () => {
        const expected = DEFAULT_ITEM_CADASTRAR;
        const {nome, poder} = await mongo.create(DEFAULT_ITEM_CADASTRAR);
        const actual = {nome, poder}

        assert.deepStrictEqual(actual, expected)
    });

    it('Deve pesquisar', async () => {
       const expected = DEFAULT_ITEM_CADASTRAR;
       const [{nome, poder}] = await mongo.read({nome: DEFAULT_ITEM_CADASTRAR.nome});
       const actual = {nome, poder}

       assert.deepStrictEqual(actual, expected);
    });

    it('Deve atualizar', async () => {
        const expected = {
            ...DEFAULT_ITEM_ATUALIZAR,
            nome: 'Cristiano Ronaldo'
        };

        await mongo.update(MOCK_HEROI_ID, expected);
        const [{nome, poder}] = await mongo.read({_id: MOCK_HEROI_ID});
        const actual = {nome, poder};

        assert.deepStrictEqual(actual, expected);
    });

    it('Deve deletar', async () => {
       const expected = [];
       const heroiParaDeletar = await mongo.create(DEFAULT_ITEM_CADASTRAR);
       await mongo.delete(heroiParaDeletar._id);
       const actual = await mongo.read({_id: heroiParaDeletar._id});

       assert.deepStrictEqual(actual, expected);
    });

});
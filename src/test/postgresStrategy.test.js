const assert = require('assert');
const DBStrategy = require('../db/databaseStrategy');
const Postgres = require('../db/postgres/postgres');
const Heroi = require('../db/postgres/model/heroi')

let db = {};

const MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao negro',
    poder: 'Flechas'
};

const MOCK_HEROI_ATUALIZAR = {
  nome: 'Batman',
  poder: 'Dinheiro'
};

describe('Suite teste postgres', function () {
    this.timeout(1000);
    this.beforeAll(async function () {
        const connection = Postgres.connect();
        const model = await Postgres.defineModel(connection, Heroi);
        db = new DBStrategy(new Postgres(connection, model))
        await db.deleteWithoutWhere();
        await db.create(MOCK_HEROI_CADASTRAR);
        await db.create(MOCK_HEROI_ATUALIZAR);
    });

    it('Deve conectar no postgres', async function() {
        const expected = true;
        const actual = await db.isConnected();
        assert.deepStrictEqual(actual, expected);
    });

    it('Deve cadastrar no banco db', async function() {
        const expected = MOCK_HEROI_CADASTRAR;
        const actual = await db.create(MOCK_HEROI_CADASTRAR);

        await db.delete(actual.id);
        delete actual.id;
        assert.deepStrictEqual(actual, expected);
    });

    it('Deve buscar', async function() {
        const expected = MOCK_HEROI_CADASTRAR;
        const [actual] = await db.read({nome: MOCK_HEROI_CADASTRAR.nome});
        delete actual.id;

        assert.deepStrictEqual(actual, expected);
    });

    it('Deve atualizar', async function() {
       const expected = {
           ...MOCK_HEROI_ATUALIZAR,
           nome: 'Mulher Maravilha'
       };

       const [item] = await db.read({nome: MOCK_HEROI_ATUALIZAR.nome});
       await db.update(item.id, expected);
       const [actual] = await db.read(item.id);

       assert.deepStrictEqual(actual.nome, expected.nome);

    });

    it('Remover pelo id', async function() {
        const [item] = await db.read();
        await db.delete(item.id);
        const [actual] = await db.read(item.id);
        const expected = undefined;

        assert.deepStrictEqual(actual, expected);
    });
});
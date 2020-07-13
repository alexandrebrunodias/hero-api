const assert = require('assert');
const api = require('../api');
const Postgres = require('../db/postgres/postgres');
const DBStrategy = require('../db/databaseStrategy');
const TableUsuario = require('../db/postgres/model/usuario');

let app = {}

const autenticar = (username, password) => {
    return app.inject({
        method: 'POST',
        url: '/login',
        payload: {
            username,
            password
        }
    });
};

const consultar = (token) => {
    return app.inject({
        method: 'GET',
        headers: {
            authorization: token
        },
        url: `/herois`
    });
};

const CREDENCIAIS = {
    username: 'Xuxadasilva',
    password: '123',
}

const CREDENCIAIS_DB = {
    username: CREDENCIAIS.username.toLowerCase(),
    password: '$2b$04$rXLn3/2AfNj2z70VyOwO6eYGeh1T6i1T8Br1Cxh0gKZx85T7QBIVy'
}

let tableUsuario = {}

describe('Suite dos recursos de Auth', function () {
    this.beforeAll(async () => {
        app = await api;

        const connection = Postgres.connect();
        const model = await Postgres.defineModel(connection, TableUsuario);
        tableUsuario = new DBStrategy(new Postgres(connection, model));

        await tableUsuario.update(null, CREDENCIAIS_DB, true);

    });

    it('POST /login deve retornar um token', async () => {
        const result = await autenticar(CREDENCIAIS.username, CREDENCIAIS.password);
        const response = JSON.parse(result.payload);
        assert.deepStrictEqual(result.statusCode, 200);
        assert.ok(response.token.length > 10);
    });


    it.skip('POST /login deve retornar erro ao tentar autenticar', async () => {
        const response = await autenticar(CREDENCIAIS.username, CREDENCIAIS.password);
        const { token } = JSON.parse(response.payload);


        const [{ id }] = await tableUsuario.read({ username: CREDENCIAIS_DB.username })
        await tableUsuario.delete(id);

        const result = await consultar(token);
        const payload = JSON.parse(result.payload);

        assert.deepStrictEqual(result.statusCode, 401);
        assert.deepStrictEqual(payload.message, 'Invalid credentials');
    });
});
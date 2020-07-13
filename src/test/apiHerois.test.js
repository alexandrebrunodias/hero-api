const assert = require('assert');
const api = require('../api');

let app = {};
let MOCK_ID = '';
const FAKE_ID = '4f01516f86eb1a720e03ddc5'
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTU5NDU5OTU4MH0.DvqnVu2recGmUeUQLtNSgdp4FndSACVtdYufygwP0ac'

const MOCK_HEROI_CADASTRAR = {
    nome: 'Vale refeição',
    poder: 'Me alimentar'
};

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Super Atualizador',
    poder: 'Atualizar heroi'
};

const headers = {
    authorization: TOKEN
}

const atualizar = (id, heroi) => {
    return app.inject({
        method: 'PATCH',
        url: `/herois/${id}`,
        headers,
        payload: JSON.stringify(heroi)
    });
};

const cadastrar = heroi => {
    return app.inject({
        method: 'POST',
        headers,
        url: '/herois',
        payload: JSON.stringify(heroi)
    });
};

const consultar = queryString => {
    return app.inject({
        method: 'GET',
        headers,
        url: `/herois?${queryString}`
    });
};

const deletar = id => {
    return app.inject({
        method: 'DELETE',
        headers,
        url: `/herois/${id}`
    })
}

describe('Suite API-Herois', function () {
    this.beforeAll(async () => {
        app = await api;

        const result = await cadastrar(MOCK_HEROI_ATUALIZAR);
        MOCK_ID = JSON.parse(result.payload)._id

        await cadastrar({ nome: 'TESTE 1', poder: 'PODER 1' });
        await cadastrar({ nome: 'TESTE 2', poder: 'PODER 2' });
        await cadastrar({ nome: 'TESTE 3', poder: 'PODER 3' });
    });

    it('GET /herois deve retornar 10 registros', async () => {
        const result = await consultar('skip=0&limit=10');

        const response = JSON.parse(result.payload);
        assert.deepStrictEqual(result.statusCode, 200);
        assert.ok(Array.isArray(response));
    });

    it('GET /herois deve retornar 3 registros', async () => {
        const TAMANHO_LIMITE = 3;
        const result = await consultar(`skip=0&limit=${TAMANHO_LIMITE}`);

        const response = JSON.parse(result.payload);
        assert.deepStrictEqual(result.statusCode, 200);
        assert.deepStrictEqual(response.length, TAMANHO_LIMITE);
    });

    it('GET /herois deve retornar erro', async () => {
        const LIMITE_LETRAS = 'TEST';
        const result = await consultar(`skip=0&limit=${LIMITE_LETRAS}`);

        const expectedResponse = JSON.stringify({
            "statusCode": 400,
            "error": "Bad Request",
            "message": "\"limit\" must be a number",
            "validation": {
                "source": "query",
                "keys": ["limit"]
            }
        });

        assert.deepStrictEqual(result.payload, expectedResponse);
    });

    it('GET /herois deve filtrar pelo nome', async () => {
        const NAME = MOCK_HEROI_ATUALIZAR.nome;
        const result = await consultar(`skip=0&limit=1&nome=${NAME}`)

        const response = JSON.parse(result.payload);
        assert.deepStrictEqual(response[0].nome, NAME);
    });

    it('POST /herois deve cadastrar um heroi', async () => {
        const result = await cadastrar(MOCK_HEROI_CADASTRAR);
        const { _id, message } = JSON.parse(result.payload);

        assert.deepStrictEqual(result.statusCode, 200);
        assert.notStrictEqual(_id, undefined);
        assert.deepStrictEqual(message, 'Herói cadastrado com sucesso!');
    });

    it('PATCH /herois deve atualizar um heroi', async () => {
        const id = MOCK_ID
        const expected = {
            nome: 'Senhor atualizador'
        }

        const result = await atualizar(id, expected);

        const statusCode = result.statusCode
        const response = JSON.parse(result.payload)

        const resultAtualizado = await consultar(`id=${id}`);
        const responseAtualizado = JSON.parse(resultAtualizado.payload);

        assert.deepStrictEqual(statusCode, 200)
        assert.deepStrictEqual(response.message, "Herói atualizado com sucesso!")
        assert.deepStrictEqual(responseAtualizado[0].nome, expected.nome)
    });

    it('PATCH /herois não deve atualizar herói inexistente', async () => {
        const expected = {
            nome: 'Senhor atualizador'
        }

        const result = await atualizar(FAKE_ID, expected);

        const statusCode = result.statusCode
        const response = JSON.parse(result.payload)

        assert.deepStrictEqual(statusCode, 412)
        assert.deepStrictEqual(response.message, "Héroi não encontrado");
    });

    it('DELETE /herois deve deletar um heroi', async () => {
        const result = await deletar(MOCK_ID);
        const response = JSON.parse(result.payload);

        const resultFind = await consultar(MOCK_ID);
        const { nome, poder } = JSON.parse(resultFind.payload);

        assert.deepStrictEqual(response.message, 'Herói removido com sucesso!');
        assert.deepStrictEqual(result.statusCode, 200);
        assert.deepStrictEqual(nome, undefined);
        assert.deepStrictEqual(poder, undefined);
    });

    it('DELETE /herois não deve deletar herói inexistente', async () => {
        const result = await deletar(FAKE_ID);
        const response = JSON.parse(result.payload);

        assert.deepStrictEqual(response.message, 'Héroi não encontrado');
        assert.deepStrictEqual(result.statusCode, 412);
    });

});
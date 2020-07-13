const assert = require('assert');
const PasswordHelper = require('../helper/passwordHelper')

const password = 'senha123'
const hash = '$2b$04$jO5nbF87oeTS/7Iw96qx1.P5X1P0FDJavz3npWEaaForcKjcqorM6'

describe('Suite password helper', function() {
    it('Deve gerar um Hash', async () => {
        const hash = await PasswordHelper.hash(password);
        assert.ok(hash.length > 10);
    });

    it('Deve comparar um hash', async () => {
        const equal = PasswordHelper.compare(password, hash);
        assert.ok(equal)
    });
});
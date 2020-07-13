const Bcrypt = require('bcrypt');
const { promisify } = require('util');

const hash = promisify(Bcrypt.hash);
const compare = promisify(Bcrypt.compare);

//Seed de aleatoriedade
const SALT = 3;

class PasswordHelper {

    static hash(password) {
        return hash(password, SALT)
    }

    static compare(password, hash) {
        return compare(password, hash)
    }
}

module.exports = PasswordHelper
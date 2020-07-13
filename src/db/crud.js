const NotImplementedException = require('../exception/notImplementedException')

class Crud {

    create(item) {
        throw new NotImplementedException();
    }

    read(query, skip, limit) {
        throw new NotImplementedException();
    }

    update(id, item) {
        throw new NotImplementedException();
    }

    delete(id) {
        throw new NotImplementedException();
    }

    deleteWithoutWhere() {
        throw new NotImplementedException();
    }

    connect() {
        throw new NotImplementedException();
    }

    isConnected() {
        throw new NotImplementedException();
    }
}

module.exports = Crud;
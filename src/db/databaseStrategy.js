const Crud = require('./crud');

class DatabaseStrategy extends Crud {
    constructor(strategy) {
        super();
        this._strategy = strategy;
    }
    create(item) {
        return this._strategy.create(item);
    }
    read(query, skip, limit) {
        return this._strategy.read(query, skip, limit);
    }
    update(id, item, upsert = false) {
        return this._strategy.update(id, item, upsert);
    }
    delete(id) {
        return this._strategy.delete(id);
    }
    deleteWithoutWhere() {
        return this._strategy.deleteWithoutWhere();
    }
    isConnected() {
        return this._strategy.isConnected();
    }
    connect() {
        this._strategy.connect();
    }
    close() {
        this._strategy.close();
    }
}

module.exports = DatabaseStrategy;
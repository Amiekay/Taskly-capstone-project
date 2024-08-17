"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
mongoose.Promise = global.Promise;
class Connection {
    constructor() {
        this.mongoServer = MongoMemoryServer.create();
        this.connection = null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mongoServer = yield MongoMemoryServer.create();
            const mongoUri = this.mongoServer.getUri();
            this.connection = yield mongoose.connect(mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose.disconnect();
            yield this.mongoServer.stop();
        });
    }
    cleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            const models = Object.keys(this.connection.models);
            const promises = [];
            models.map((model) => {
                promises.push(this.connection.models[model].deleteMany({}));
            });
            yield Promise.all(promises);
        });
    }
}
/**
 * Create the initial database connection.
 *
//  * @async
//  * @return {Promise<Object>}
 */
exports.connect = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = new Connection();
    yield conn.connect();
    return conn;
});

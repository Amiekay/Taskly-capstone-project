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
const supertest = require('supertest');
const app = require('./testApp');
const { connect } = require('./database');
const UserModel = require('../models/userModel');
// Test suite
describe('Authentication Tests', () => {
    let connection;
    // before hook
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        connection = yield connect();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.cleanup();
    }));
    // after hook
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.disconnect();
    }));
    // Test case
    it('should successfully signup a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest(app)
            .post('/users/signup')
            .set('content-type', 'application/json')
            .send({
            firstName: "Amara",
            lastName: "Kalu",
            password: "password",
            email: "mara@gmail.com",
        });
        // expectations
        expect(response.status).toEqual(200);
    }));
    it('should throw an errow for bad request - wrong spelling', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest(app)
            .post('/users/signup')
            .set('content-type', 'application/json')
            .send({
            firstname: "Amara",
            last_name: "Kalu",
            password: "password",
            email: "mara@gmail.com",
        });
        // expectations
        expect(response.status).toEqual(400);
    }));
    it('should throw an errow for missing fields that are required - email', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest(app)
            .post('/users/signup')
            .set('content-type', 'application/json')
            .send({
            firstName: "Amara",
            lastName: "Kalu",
            password: "password",
        });
        // expectations
        expect(response.status).toEqual(400);
    }));
    it('should throw an error when user already exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest(app)
            .post('/users/signup')
            .set('content-type', 'application/json')
            .send({
            firstName: "Amara",
            lastName: "Kalu",
            password: "password",
            email: "mara@gmail.com",
        });
        const res = yield supertest(app)
            .post('/users/signup')
            .set('content-type', 'application/json')
            .send({ firstName: "Amara",
            lastName: "Kalu",
            password: "password",
            email: "mara@gmail.com",
        });
        // expectations
        expect(res.status).toEqual(409);
        expect(res.body).toMatchObject({ message: 'user already created' });
    }));
    // Test case
    it('should successfully login a user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield UserModel.create({
            firstName: "Amara",
            lastName: "Kalu",
            password: "password",
            email: "mara@gmail.com",
        });
        const response = yield supertest(app)
            .post('/users/login')
            .set('content-type', 'application/json')
            .send({
            email: "mara@gmail.com",
            password: "password"
        });
        // expectations
        expect(response.status).toEqual(200);
    }));
    it('should not successfully login a user, when user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield UserModel.create({
            firstName: "Amara",
            lastName: "Kalu",
            password: "password",
            email: "mara@gmail.com",
        });
        const response = yield supertest(app)
            .post('/users/login')
            .set('content-type', 'application/json')
            .send({
            email: "amara@example.com",
            password: "password"
        });
        // expectations
        expect(response.status).toEqual(401);
        expect(response.body).toMatchObject({
            message: 'Unauthorized, please signup',
        });
    }));
    it('should not successfully login a user, when user exists but password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        yield UserModel.create({
            firstName: "Amara",
            lastName: "Kalu",
            password: "password",
            email: "mara@gmail.com",
        });
        const response = yield supertest(app)
            .post('/users/login')
            .set('content-type', 'application/json')
            .send({
            email: "mara@gmail.com",
            password: "JU2222"
        });
        // expectations
        expect(response.status).toEqual(422);
        expect(response.body).toMatchObject({
            message: 'Email or password is not correct',
        });
    }));
});

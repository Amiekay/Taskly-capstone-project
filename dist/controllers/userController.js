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
Object.defineProperty(exports, "__esModule", { value: true });
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, organization, role } = req.body;
    try {
        const User = yield userModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            organization: organization,
            role: role
        });
        res.status(200).json({
            message: 'Registered successfuly',
            User,
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'an error occured',
            data: error
        });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // check if user exists
        const user = yield userModel.findOne({
            email: email
        });
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized, please signup'
            });
        }
        const validPassword = yield user.isValidPassword(password);
        console.log(password);
        if (!validPassword) {
            return res.status(422).json({
                message: 'Email or password is not correct',
            });
        }
        const token = yield jwt.sign({ email: user.email, _id: user._id, firstName: user.firstName }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful',
            token: token,
            data: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    }
    catch (error) {
        res.status(401).json({
            message: 'Bad Request',
            error: error
        });
    }
});
module.exports = { createUser, login
};

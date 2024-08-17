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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const userModel = require('../models/userModel');
require('dotenv').config();
app.use(express_1.default.json());
const bearerTokenAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers;
        if (!authHeader.authorization) {
            return res.status(401).json({ message: 'You are not authenticated!' });
        }
        const token = authHeader.authorization.split(' ')[1]; // berear tokenvalue
        const decoded = yield jwt.verify(token, process.env.JWT_SECRET);
        const user = yield userModel.findOne({ _id: decoded._id });
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        if (user) {
            req.user = user;
        }
        console.log(user);
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
});
module.exports = {
    bearerTokenAuth
};

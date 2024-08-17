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
const express = require('express');
const app = express();
const userRoute = require('../routes/userRoute');
const userModel = require('../models/userModel');
app.use(express.json());
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel.find({ email: 'mara@gmail.com' }).limit(2).select({ firstName: 1, _id: 1 });
    return res.status(200).json({ users });
}));
app.use('/users', userRoute);
// app.use('/organizations', organizationRoute)
app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'Route not found'
    });
});
// globah error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        data: null,
        error: 'Server Error'
    });
});
module.exports = app;

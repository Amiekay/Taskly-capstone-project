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
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");
const express = require("express");
const app = express();
const userModel = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Can't be blank"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: true
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: "Organization",
        required: true,
    },
    role: { type: String, enum: ["owner", "member"], default: "member" },
}, { timestamps: true });
// before save
app.use(express.json());
userModel.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // const user = this
        const hash = yield bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    });
});
userModel.methods.isValidPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(this.password);
        const hash = yield bcrypt.hash(password, 10);
        console.log(hash);
        const compare = yield bcrypt.compare(password, this.password);
        return compare;
    });
};
module.exports = mongoose.model("User", userModel);

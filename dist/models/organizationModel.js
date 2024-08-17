"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orgModel = new mongoose_1.default.Schema({
    organizationName: {
        type: String,
        required: true,
        unique: true,
    },
    sector: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User"
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model("Organization", orgModel);

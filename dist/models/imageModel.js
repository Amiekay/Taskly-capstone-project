"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const imageSchema = new mongoose_1.default.Schema({
    filename: String,
    path: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose_1.default.model('Image', imageSchema);

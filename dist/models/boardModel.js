"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const boardModel = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    visibilty: {
        type: String,
        enum: ["private", "workspace", "public"],
        default: "workspace",
        required: true,
    },
    organization: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Organization",
        required: true,
    },
    boardMembers: [{ type: mongoose_1.default.Schema.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose_1.default.Schema.ObjectId, ref: "Task" }],
}, { timestamps: true });
module.exports = mongoose_1.default.model("Board", boardModel);

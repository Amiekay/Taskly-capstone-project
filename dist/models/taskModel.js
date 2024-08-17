"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskModel = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    labels: { type: String },
    description: {
        type: String,
        // required: true
    },
    owner: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        default: "todo",
    },
    comment: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    comments: [
        {
            user: { type: mongoose_1.default.Schema.ObjectId, ref: "User" },
            comment: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    attachments: [
        {
            type: { type: String, enum: ["image", "video"], required: true },
            url: { type: String, required: true },
        },
    ],
    assignedTo: [{ type: mongoose_1.default.Schema.ObjectId, ref: "User" }],
    board: { type: mongoose_1.default.Schema.ObjectId, ref: "Board", required: true },
});
module.exports = mongoose_1.default.model("Task", taskModel);

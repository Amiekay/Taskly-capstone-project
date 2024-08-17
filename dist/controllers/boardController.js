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
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const orgModel = require('../models/organizationModel');
const boardModel = require('../models/boardModel');
const userModel = require('../models/userModel');
const app = (0, express_1.default)();
app.use(express_1.default.json());
const createBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.user = req.user;
        const newBoard = req.body;
        const organization = yield orgModel.findById(req.body.user.organization);
        if (!organization)
            return res.status(404).json({ message: 'Organization not found' });
        //        
        const board = yield boardModel.create({ title: newBoard.title, organization: organization._id });
        if (!board.boardMembers.includes(req.body.user._id)) {
            board.boardMembers.push(req.body.user._id);
            board.save();
        }
        return res.status(201).json(board);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
// Add members to board
const addMembersToBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boardId = req.params.boardId;
        console.log(boardId);
        const { email } = req.body;
        const user = yield userModel.findOne({ email });
        console.log(user);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const board = yield boardModel.findById(boardId);
        if (!board)
            return res.status(404).json({ message: "board not found" });
        if (!board.boardMembers.includes(user._id))
            board.boardMembers.push(user._id);
        console.log(board.boardMembers);
        yield board.save();
        return res.status(200).json(board);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
module.exports = { createBoard, addMembersToBoard };

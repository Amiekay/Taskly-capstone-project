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
exports.uploadTaskAttachment = exports.updateTaskStatus = exports.addComment = exports.getTasks = exports.assignTaskToUser = exports.createTask = void 0;
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const notification_1 = require("../utils/notification");
const boardModel = require('../models/boardModel');
const userModel = require('../models/userModel');
const taskModel = require('../models/taskModel');
const app = (0, express_1.default)();
const redisClient = require('../integrations/redis');
app.use(express_1.default.json());
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boardId = req.params.boardId;
        const { title, description, status, priority, labels, startDate, dueDate } = req.body;
        req.body.user = req.user;
        const user = yield userModel.findById(req.body.user._id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const board = yield boardModel.findById(boardId);
        if (!board)
            return res.status(404).json({ message: 'Board not found' });
        // check if user is a member or owner of org/board
        console.log(user._id);
        console.log(board);
        console.log(boardId);
        if (board.boardMembers.includes(user._id)) {
            const task = yield taskModel.create({
                title,
                description,
                status,
                priority,
                labels,
                startDate,
                dueDate,
                board: board._id
            });
            board.tasks.push(task._id);
            yield board.save();
            if (task.comment) {
                task.comments.push({ user: user._id, comment: task.comment });
            }
            yield task.save();
            return res.status(201).json(task);
        }
        else {
            return res.status(404).json({ message: 'user is not a board member' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createTask = createTask;
// Assign task add notification
const assignTaskToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        const { email, title } = req.body;
        const user = yield userModel.findOne({ email });
        const board = yield boardModel.findOne({ title });
        console.log(user);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const task = yield taskModel.findById(taskId);
        if (!task)
            return res.status(404).json({ message: "task not found" });
        if (board.boardMembers.includes(user._id)) {
            // assign task to user
            yield task.assignedTo.push(user._id);
            yield task.save();
        }
        //   call nodemailer
        for (let userId of task.assignedTo) {
            const user = userModel.findById(userId);
            (0, notification_1.sendNotification)(user.email, 'New assigned task', "Kindly do the assigned task");
        }
        return res.status(200).json(task);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.assignTaskToUser = assignTaskToUser;
// Get tasks with filters
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId, status, assignedTo, priority, labels } = req.query;
        const filter = {};
        if (boardId)
            filter.board = boardId;
        if (status)
            filter.status = status;
        if (assignedTo)
            filter.assignedTo = assignedTo;
        if (priority)
            filter.priority = priority;
        if (labels)
            filter.labels = { $in: labels };
        // // Check cache
        const cacheKey = `tasks:JSON.stringify(${filter})`;
        const data = yield redisClient.get(cacheKey);
        console.log(data);
        if (data) {
            console.log('returning from cache');
            return res.json({
                data: JSON.parse(data),
                error: null,
            });
        }
        const tasks = yield taskModel.find({}).where(filter);
        // set cache
        yield redisClient.setEx(cacheKey, 10 * 60, JSON.stringify(tasks));
        return res.status(200).json(tasks);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getTasks = getTasks;
// Add a comment to a task and  notify assigned users
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        req.body.user = req.user;
        const { comment, title } = req.body;
        const task = yield taskModel.findById(taskId);
        if (!task)
            return res.status(404).json({ message: 'Task not found' });
        const user = yield userModel.findById(req.body.user._id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const board = yield boardModel.findOne({ boardTitle: title });
        if (board.boardMembers.includes(user._id)) {
            // assign task to user
            yield task.comments.push(user._id);
            yield task.save();
        }
        //    call nodemailer
        for (let userId of task.assignedTo) {
            const user = userModel.findById(userId);
            (0, notification_1.sendNotification)(user.email, 'New comment', "Kindly check your tasks");
        }
        return res.status(200).json(task);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.addComment = addComment;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskId;
        req.body.user = req.user;
        const { title, status } = req.body;
        const user = yield userModel.findById(req.body.user.id);
        const board = yield boardModel.findOne({ title });
        if (!board)
            return res.status(404).json({ message: "Board not found" });
        console.log(user);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const task = yield taskModel.findById(taskId);
        if (!task)
            return res.status(404).json({ message: "task not found" });
        if (board.boardMembers.includes(user._id)) {
            // update status
            yield task.updateOne({ status }, { new: true }).select('-__v');
        }
        return res.status(200).json(task);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.updateTaskStatus = updateTaskStatus;
const uploadTaskAttachment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const task = yield taskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.attachments.push({
            url: req.file.path,
            type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
        });
        yield task.save();
        res.status(200).json({ message: 'Attachment uploaded successfully', task });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.uploadTaskAttachment = uploadTaskAttachment;

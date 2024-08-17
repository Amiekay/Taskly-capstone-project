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
exports.generateWeeklyReport = void 0;
const taskModel = require('../models/taskModel');
const generateWeeklyReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.params.organizationId;
        req.body.user = req.user;
        if (req.body.user.role === 'owner' && organizationId === req.body.user.organization) {
            const tasks = yield taskModel.find({});
            const completedTasks = tasks.filter((task) => task.status === 'completed').length;
            const pendingTasks = tasks.filter((task) => task.status === 'in-progress').length;
            const todoTasks = tasks.filter((task) => task.status === 'todo').length;
            const avgCompletionTime = calculateAvgCompletionTime(tasks);
            return res.status(200).json({
                completedTasks,
                pendingTasks,
                todoTasks,
                avgCompletionTime
            });
        }
        ;
        function calculateAvgCompletionTime(tasks) {
            const completedTasks = tasks.filter(task => task.status === 'completed');
            if (completedTasks.length === 0)
                return 0;
            const totalTime = completedTasks.reduce((acc, task) => {
                const timeDiff = new Date(task.updatedAt).getTime() - new Date(task.startDate).getTime();
                return acc + timeDiff;
            }, 0);
            return totalTime / completedTasks.length;
        }
    }
    catch (error) {
        throw error;
    }
});
exports.generateWeeklyReport = generateWeeklyReport;

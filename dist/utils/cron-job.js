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
const node_cron_1 = __importDefault(require("node-cron"));
require('dotenv').config();
const notification_1 = require("../utils/notification");
const userModel = require('../models/userModel');
const taskModel = require('../models/taskModel');
const moment_1 = __importDefault(require("moment"));
// Runs every hour to check for tasks with approaching due dates
node_cron_1.default.schedule('0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Running task notification cron job...');
    const now = (0, moment_1.default)();
    const oneHourFromNow = (0, moment_1.default)().add(1, 'hour');
    const twelveHoursFromNow = (0, moment_1.default)().add(12, 'hours');
    const oneDayFromNow = (0, moment_1.default)().add(1, 'day');
    try {
        // Find tasks with due dates 1 hour, 12 hours, or 1 day from now
        const tasks = yield taskModel.find({
            dueDate: {
                $gte: now.toDate(),
                $lte: oneDayFromNow.toDate()
            }
        });
        for (let task of tasks) {
            const dueDate = (0, moment_1.default)(task.dueDate);
            let notificationMessage = '';
            if (dueDate.isSame(oneHourFromNow, 'minute')) {
                notificationMessage = `Reminder: Your task "${task.title}" is due in 1 hour.`;
            }
            else if (dueDate.isSame(twelveHoursFromNow, 'minute')) {
                notificationMessage = `Reminder: Your task "${task.title}" is due in 12 hours.`;
            }
            else if (dueDate.isSame(oneDayFromNow, 'minute')) {
                notificationMessage = `Reminder: Your task "${task.title}" is due in 1 day.`;
            }
            if (notificationMessage) {
                for (let userId of task.assignedTo) {
                    const user = userModel.findById(userId);
                    (0, notification_1.sendNotification)(user.email, 'Task duedate reminder', notificationMessage);
                }
            }
        }
    }
    catch (error) {
        console.error('Error running task notification cron job:', error);
    }
}));

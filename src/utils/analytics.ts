const taskModel = require('../models/taskModel') 
import { Request, Response } from "express";


const generateWeeklyReport = async (req:Request, res:Response) => {

try {
    const organizationId = req.params.organizationId
req.body.user = req.user
if(req.body.user.role === 'owner' && organizationId === req.body.user.organization){
    const tasks = await taskModel.find({});
    const completedTasks = tasks.filter((task: { status: string; }) => task.status === 'completed').length;
    const pendingTasks = tasks.filter((task: { status: string; }) => task.status === 'in-progress').length;
    const todoTasks = tasks.filter((task: { status: string; }) => task.status === 'todo').length;

    const avgCompletionTime = calculateAvgCompletionTime(tasks);

    return res.status(200).json({
        completedTasks,
        pendingTasks,
        todoTasks,
        avgCompletionTime
    });
};

function calculateAvgCompletionTime(tasks: any[]){
    const completedTasks = tasks.filter(task => task.status === 'completed');
    if (completedTasks.length === 0) return 0;

    const totalTime = completedTasks.reduce((acc, task) => {
        const timeDiff = new Date(task.updatedAt).getTime() - new Date(task.startDate).getTime();
        return acc + timeDiff;
    }, 0);

    return totalTime / completedTasks.length;
}

} catch (error) {
    throw error
}
};

export { generateWeeklyReport };
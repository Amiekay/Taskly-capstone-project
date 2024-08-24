import { Response, Request } from "express";
require("dotenv").config();
import express from "express";
import { sendNotification } from "../utils/notification";
const boardModel = require("../models/boardModel");
const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
const app = express();
const redisClient= require("../integrations/redis");

app.use(express.json());

export const createTask = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.boardId;

    const { title, description, status, priority, labels, startDate, dueDate } =
      req.body;

    req.body.user = req.user;
    const user = await userModel.findById(req.body.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const board = await boardModel.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // check if user is a member or owner of org/board

    if (board.boardMembers.includes(user._id)) {
      const task = await taskModel.create({
        title,
        description,
        status,
        priority,
        labels,
        startDate,
        dueDate,
        board: board._id,
      });

      board.tasks.push(task._id);
      await board.save();
      if (task.comment) {
        task.comments.push({ user: user._id, comment: task.comment });
      }

      await task.save();

      return res.status(201).json(task);
    } else {
      return res.status(404).json({ message: "user is not a board member" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Assign task add notification

export const assignTaskToUser = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;

    const { email, title } = req.body;

    const user = await userModel.findOne({ email });
    const board = await boardModel.findOne({ title });

    console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const task = await taskModel.findById(taskId);
    if (!task) return res.status(404).json({ message: "task not found" });

    if (!board.boardMembers.includes(user._id)) {
      return res.status(404).json({ message: "not a board member" });
    }
    if (!task.assignedTo.includes(user._id)) {
      // assign task to user
      await task.assignedTo.push(user._id);
      await task.save();
    } else {
      return res
        .status(404)
        .json({ message: "you have already been assigned this task" });
    }
    //   call nodemailer

    sendNotification(
      user.email,
      "New assigned task",
      "Kindly do the assigned task"
    );

    return res.status(200).json(task);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get tasks with filters
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { boardId, status, assignedTo, priority, labels } = req.query;


    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const filter: any = {};
    if (boardId) filter.board = boardId;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (priority) filter.priority = priority;
    if (labels) filter.labels = { $in: labels };

    // Check cache
    const cacheKey = `/organizations/board/tasks:JSON.stringify(${filter}):${limit}:${page}`;
    console.log(cacheKey);
    const data = await redisClient.get(cacheKey);
    
    if (data) {
      console.log("returning from cache");

      return res.json({
        data: JSON.parse(data),
        error: null,
      });
    }

    const tasks = await taskModel
      .find({})
      .where(filter)
      .skip((page - 1) * limit)
      .limit(limit);
    // set cache
    await redisClient.setEx(cacheKey, 10 * 60, JSON.stringify(tasks));
    return res.status(200).json(tasks);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Add a comment to a task and  notify assigned users
export const addComment = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    req.body.user = req.user;
    const { comment, title } = req.body;

    const task = await taskModel.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const user = await userModel.findById(req.body.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const board = await boardModel.findOne({ boardTitle: title });

    if (board.boardMembers.includes(user._id)) {
      // assign task to user
      await task.comments.push({ comment, user });
      await task.save();
    }
    //    call nodemailer
    for (let userId of task.assignedTo) {
      const user = await userModel.findById(userId);
      console.log(user.email);
      sendNotification(user.email, "New comment", "Kindly check your tasks");
    }

    return res.status(200).json(task);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    req.body.user = req.user;
    const { title, status } = req.body;

    const user = await userModel.findById(req.body.user.id);
    const board = await boardModel.findOne({ title });
    if (!board) return res.status(404).json({ message: "Board not found" });

    console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const task = await taskModel.findById(taskId);
    if (!task) return res.status(404).json({ message: "task not found" });

    if (board.boardMembers.includes(user._id)) {
      // update status
      await task.updateOne({ status }, { new: true }).select("-__v");
    }

    return res.status(200).json(task);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadTaskAttachment = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.attachments.push({
      url: req.file.path,
      type: req.file.mimetype.startsWith("video") ? "video" : "image",
    });

    await task.save();

    res.status(200).json({ message: "Attachment uploaded successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

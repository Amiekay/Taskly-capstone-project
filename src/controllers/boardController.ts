// Create a new board within an organization
import { Response, Request } from "express";
require("dotenv").config();
import express from "express";
const orgModel = require("../models/organizationModel");
const boardModel = require("../models/boardModel");
const userModel = require("../models/userModel");
const app = express();

app.use(express.json());

const createBoard = async (req: Request, res: Response) => {
  try {
    req.body.user = req.user;
    const newBoard = req.body;

    const organization = await orgModel.findById(req.body.user.organization);
    if (!organization)
      return res.status(404).json({ message: "Organization not found" });

    //
    const board = await boardModel.create({
      title: newBoard.title,
      organization: organization._id,
    });
    if (!board.boardMembers.includes(req.body.user._id)) {
      board.boardMembers.push(req.body.user._id);
      board.save();
    }

    return res.status(201).json(board);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Add members to board
const addMembersToBoard = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.boardId;
    console.log(boardId);

    const { email } = req.body;

    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const board = await boardModel.findById(boardId);
    if (!board) return res.status(404).json({ message: "board not found" });

    if (!board.boardMembers.includes(user._id))
      board.boardMembers.push(user._id);
    console.log(board.boardMembers);

    await board.save();

    return res.status(200).json(board);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = { createBoard, addMembersToBoard };

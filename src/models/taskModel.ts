import mongoose from "mongoose";

const taskModel = new mongoose.Schema(
  {
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
      type: mongoose.Schema.ObjectId,
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
        user: { type: mongoose.Schema.ObjectId, ref: "User" },
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
    assignedTo: [{ type: mongoose.Schema.ObjectId, ref: "User" }],

    board: { type: mongoose.Schema.ObjectId, ref: "Board", required: true },
  },
  // { timestamps: true }
);

module.exports = mongoose.model("Task", taskModel);

import mongoose from "mongoose";

const boardModel = new mongoose.Schema(
  {
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
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
      required: true,
    },
    boardMembers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.ObjectId, ref: "Task" }],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Board", boardModel);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");
const express = require("express");
const app = express();
import { Request, Response, NextFunction } from "express";

const userModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: [true, "Can't be blank"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
    },

    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
      required: true,
    },

    role: { type: String, enum: ["owner", "member"], default: "member" },
  },
  { timestamps: true }
);

// before save

app.use(express.json());
userModel.pre("save", async function (this: any, next: NextFunction) {
  // const user = this
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

userModel.methods.isValidPassword = async function (password: String) {
  console.log(this.password);
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};
module.exports = mongoose.model("User", userModel);

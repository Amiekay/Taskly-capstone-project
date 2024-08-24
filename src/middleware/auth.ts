const jwt = require("jsonwebtoken");
import { Response, Request } from "express";
import express from "express";
const app = express();
const userModel = require("../models/userModel");

require("dotenv").config();

app.use(express.json());

const bearerTokenAuth = async (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers;

    if (!authHeader.authorization) {
      return res.status(401).json({ message: "You are not authenticated!" });
    }

    const token: String = authHeader.authorization.split(" ")[1]; // berear tokenvalue

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (user) {
      req.user = <any>user;
    }


    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = {
  bearerTokenAuth,
};

import { error } from "console";
import { Response, Request } from "express";
require("dotenv").config();
import express from "express";
const orgModel = require("../models/organizationModel");
const userModel = require("../models/userModel");
const app = express();
import mongoose from "mongoose";

app.use(express.json());

const createOrganization = async (req: Request, res: Response) => {
    // let transaction
  try {
    // transaction =await mongoose.startSession()
    // transaction.startTransaction()
    const {
      organizationName,
      sector,
      description,
      firstName,
      lastName,
      email,
      password,
    } = req.body;
    const organization = await orgModel.create({
      organizationName: organizationName,
      sector: sector,
      description: description,
    });
    if (!organization){
        throw new Error("failed to create an organization")
    }

    let isUserExist =  await userModel.findOne({email})
    
    let user
    if (!isUserExist) {
       user = await userModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      organization: organization._id,
      role: "owner",
    })}
    else user = isUserExist
    
    if (!user){
        throw new Error("failed to create a user")
    }

    organization.owner = user._id
    await organization.save()
    // await organization.updateOne({owner: user._id}, {new: true})
    // try {
    //     await transaction.commitTransaction()

    // } catch (error) {
    //     await transaction.abortTransaction()
    //     throw error
    // }


    return res.status(201).json({org: organization, user});

  } catch (error: any) {
    // if(transaction){
    //     await transaction.abortTransaction()
    //     // transaction.endSession()
    // }
    return res.status(500).json({ error});
  }
};

// Add a user to an organization
const addMembersToOrganization = async (req: Request, res: Response) => {
  try {
    const { userId, organizationId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const organization = await orgModel.findById(organizationId);
    if (!organization)
      return res.status(404).json({ message: "Organization not found" });

    if (!organization.members.includes(user._id))
      organization.members.push(user);
    await organization.save();

    user.organization = organization._id;
    await user.save();

    return res.status(200).json(organization);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = { createOrganization, addMembersToOrganization };

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
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const orgModel = require("../models/organizationModel");
const userModel = require("../models/userModel");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const createOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // let transaction
    try {
        // transaction =await mongoose.startSession()
        // transaction.startTransaction()
        const { organizationName, sector, description, firstName, lastName, email, password, } = req.body;
        const organization = yield orgModel.create({
            organizationName: organizationName,
            sector: sector,
            description: description,
        });
        if (!organization) {
            throw new Error("failed to create an organization");
        }
        let isUserExist = yield userModel.findOne({ email });
        let user;
        if (!isUserExist) {
            user = yield userModel.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                organization: organization._id,
                role: "owner",
            });
        }
        else
            user = isUserExist;
        if (!user) {
            throw new Error("failed to create a user");
        }
        organization.owner = user._id;
        yield organization.save();
        // await organization.updateOne({owner: user._id}, {new: true})
        // try {
        //     await transaction.commitTransaction()
        // } catch (error) {
        //     await transaction.abortTransaction()
        //     throw error
        // }
        return res.status(201).json({ org: organization, user });
    }
    catch (error) {
        // if(transaction){
        //     await transaction.abortTransaction()
        //     // transaction.endSession()
        // }
        return res.status(500).json({ error });
    }
});
module.exports = { createOrganization };

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
const joi_1 = __importDefault(require("joi"));
const ValidateUserCreationWithJoi = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = joi_1.default.object({
            firstName: joi_1.default.string().required(),
            lastName: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9@#]{3,30}$')).required()
        });
        yield schema.validateAsync(req.body, { abortEarly: true });
        next();
    }
    catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        });
    }
});
const LoginValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = joi_1.default.object({
            password: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
        });
        yield schema.validateAsync(req.body, { abortEarly: true });
        next();
    }
    catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        });
    }
});
module.exports = {
    ValidateUserCreationWithJoi,
    LoginValidation
};

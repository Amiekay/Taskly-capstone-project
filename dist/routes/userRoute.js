"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateUser = require('../middleware/userMiddleware');
const router = express_1.default.Router();
const controller = require('../controllers/userController');
// Create user
router.post('/signup', validateUser.ValidateUserCreationWithJoi, controller.createUser);
// login user
router.post('/login', validateUser.LoginValidation, controller.login);
module.exports = router;

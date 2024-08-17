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
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');
const organizationRoute = require('./routes/organizationRoutes');
require('./utils/cron-job');
const userModel = require('./models/userModel');
const rateLimit = require('express-rate-limit');
const client = require('./integrations/redis');
const PORT = process.env.PORT || 3000;
// configure rate limiter
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 1hr 
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 5min).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header.
});
//connect to db
connectDB();
client.connect();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// Apply the rate limiting middleware to all requests.
app.use(limiter);
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Welcome" });
});
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel.find({ email: 'mara@gmail.com' }).limit(2).select({ firstName: 1, contact: 1, _id: 1 });
    return res.status(200).json({
        users
    });
}));
app.use("/users", userRoute);
app.use("/organizations", organizationRoute);
app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'Route not found'
    });
});
// global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        data: null,
        error: 'Server Error'
    });
});
const server = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
process.on("unhandledRejection", (error, promise) => {
    console.log(`Logged Error: ${error}`);
    server.close(() => process.exit(1));
});

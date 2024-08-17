require('dotenv').config()
import express from "express";
import { Response, Request } from 'express';
import morgan from 'morgan';
const connectDB = require('./config/db')
const userRoute: any  = require('./routes/userRoute')
const organizationRoute = require('./routes/organizationRoutes')
require('./utils/cron-job')
const userModel = require('./models/userModel')
const rateLimit = require('express-rate-limit')
const client = require('./integrations/redis')
const PORT= process.env.PORT || 4000;



// configure rate limiter
const limiter = rateLimit({
	windowMs: 5* 60 * 1000, // 1hr 
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 5min).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header.
});

//connect to db
connectDB()
client.connect()

const app= express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan('dev'));



// Apply the rate limiting middleware to all requests.
app.use(limiter)

app.get("/",(req:Request, res:Response) => {
    res.status(200).json( { msg: "Welcome" }); 
  });

app.get('/users', async (req, res:Response) => {
    const users = await userModel.find({ email: 'mara@gmail.com' }).limit(2).select({ firstName: 1, contact: 1, _id: 1 })
    return res.status(200).json({
        users
    })})
  
  app.use("/users", userRoute);
  app.use("/organizations", organizationRoute);


  app.get('*', (req:Request, res:Response) => {
    return res.status(404).json({
        data: null,
        error: 'Route not found'
    })
})

// global error handler
app.use((err:any, req:Request, res:Response, next:any) => {
    console.error(err.stack)
    res.status(500).json({
        data: null,
        error: 'Server Error'
    })
})

app.listen(
    PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    }

)
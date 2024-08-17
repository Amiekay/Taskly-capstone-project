import { Request, Response } from "express"
const express = require('express')
const app = express()
const userRoute = require('../routes/userRoute')
const userModel = require('../models/userModel')




app.use(express.json())


app.get('/users', async (req:Request, res:Response) => {
    const users = await userModel.find({ email: 'mara@gmail.com' }).limit(2).select({ firstName: 1, _id: 1 })
    return res.status(200).json({users}
    )})

   
    app.use('/users', userRoute )
    // app.use('/organizations', organizationRoute)



app.get('*', (req:Request, res:Response) => {
    return res.status(404).json({
        data: null,
        error: 'Route not found'
    })
})

// globah error handler
app.use((err:any, req:Request, res:Response, next:any) => {
    console.error(err.stack)
    res.status(500).json({
        data: null,
        error: 'Server Error'
    })
})

module.exports = app;





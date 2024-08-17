const userModel = require('../models/userModel')
import { Response, Request } from 'express';
const jwt = require('jsonwebtoken')
require('dotenv').config()


const createUser = async (req:Request, res:Response)=>{
const {firstName, lastName, email, password, organization, role} = req.body

try {
    const User = await userModel.create({
         firstName: firstName,
         lastName: lastName,
         email: email,
         password:password,
         organization: organization,
         role: role
})
    res.status(200).json({
        message: 'Registered successfuly',
        User,
        
        }
    )
    }

catch (error) {
    res.status(400).json({
        message: 'an error occured',
        data: error

    })
}

}


const login = async(req:Request, res:Response)=>{
    const {email, password} = req.body

    try {
       // check if user exists
       const user = await userModel.findOne({
           email: email
       })
       if(!user){
          return res.status(401).json({
               message:'Unauthorized, please signup'  
           })
       }
           const validPassword = await user.isValidPassword(password)
       console.log(password)
           if (!validPassword) {
               return res.status(422).json({
                   message: 'Email or password is not correct',
               }) 
           }
       
           const token =  await jwt.sign({email: user.email, _id: user._id, firstName: user.firstName}, process.env.JWT_SECRET,
           { expiresIn: '1h' })

           res.status(200).json( {
           message: 'Login successful',
           token: token,
           data: {
               id: user._id,
               firstName: user.firstName,
               email: user.email,
               createdAt: user.createdAt,
               updatedAt: user.updatedAt
   
       }
   })
   
    } catch (error:any) {
       res.status(401).json({
           message: 'Bad Request',
           error: error
       })
    }
   
   }
module.exports = {createUser, login
}
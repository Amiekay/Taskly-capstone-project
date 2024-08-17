require('dotenv').config()

import mongoose from 'mongoose';

const connectDB = async ()=> {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDb Connected');   
}
module.exports = connectDB;


// const mongoose = require('mongoose')
// require('dotenv').config()

// const connectToMongodb= async () => {
//   try {
//      await mongoose.connect(process.env.MONGODB_CONNECTION_URL)
//      console.log('MongoDB Connected Successfully');
//   } catch (error) {
//     console.log(error);
//   }
// }




// module.exports = connectToMongodb
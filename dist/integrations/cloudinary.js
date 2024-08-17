"use strict";
const cloudinary_1 = require("cloudinary");
require('dotenv').config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
module.exports = { cloudinary: cloudinary_1.v2 };

const mongoose = require('mongoose');
const connectDB = require('../db/db');
connectDB()
const userSchema = new mongoose.Schema({
    fullname: String,
    username:String,
    password: String,

})
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
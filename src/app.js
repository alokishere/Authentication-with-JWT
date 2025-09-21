const express = require('express')
const authroutes = require('./routes/user.routes')
const connectDB = require('./db/db')
const User = require('./model/user.model')
const cookieParser = require('cookie-parser')
connectDB()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/auth', authroutes)

module.exports = app
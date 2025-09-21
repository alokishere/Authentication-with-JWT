
const express = require('express')
const userModel = require('../model/user.model');
const { routes } = require('../app');
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/register', async (req, res) => {
    const { fullname, username, password } = req.body;
    const existingUser = await userModel.findOne({
        username
    })
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' })
    }
    const user = await userModel.create({
        fullname, username, password
    })
    const token = jwt.sign({
        userId: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: 'User registered successfully',
        user,
    })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({
        username
    })
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid Password' })
    }

    const token = jwt.sign({
        userId: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: 'Login successful',
        user,
    })
})


router.get('/user', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({
            _id: decoded.userId
        }).select('-password -__v')

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        return res.status(200).json({
            message: 'User fetched successfully',
            user
        })

    } catch (err) {
        return res.status(401).json({
            message: 'Invalid Token'
        })
    }
})

router.post('/logout', (req,res)=>{
    res.clearCookie('token')

    res.status(200).json({
        message: 'Logout successfull'
    })
})

module.exports = router
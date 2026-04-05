const User = require('../models/User')
const jwt = require('jsonwebtoken')

// generate jwt
const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'7d'
    })
}

// register user
const registerUser=async(req, res, next)=>{
    const {name, email, password, role, codingLevel} =req.body

    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    const user=await User.create({
        name, email, password, role, codingLevel
    })

    res.status(201).json({
        user, token: generateToken(user._id)
    })
}

// login user
const loginUser=async (req, res, next)=>{
    const {email, password}= req.body

    const user=await User.findOne({email})
    if(!user){
        res.status(400)
        throw new Error("Invalid credentials");
    }

    const isMatch=await user.comparePassword(password)
    if(!isMatch){
        res.status(400)
        throw new Error("Invalid credentials");
    }

    res.json({
        user, token: generateToken(user._id)
    })
}

// get user profile
const getProfile=async (req, res, next)=>{
    const user = await User.findById(req.user.id)
    res.json(user)
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
}
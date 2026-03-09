const User = require('../models/User')
const jwt = require('jsonwebtoken')

// generate jwt
const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'7d'
    })
}

// register user
exports.registerUser=async(req, res)=>{
    try{
        const {name, email, password, role, codingLevel} =req.body

        const userExists=await User.findOne({email})
        if(userExists){
            return res.status(400).json({message: 'User already exixts'})
        }

        const user=await User.create({
            name, email, password, role, codingLevel
        })

        res.status(201).json({
            user, token: generateToken(user._id)
        })
    }
    catch(e){
        res.status(500).json({message: e.message})
    }
}

// login user
exports.loginUser=async (req, res)=>{
    try{
        const {email, password}= req.body

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const isMatch=await user.comparePassword(password)
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        res.json({
            user, token: generateToken(user._id)
        })
    } catch(e){
        res.status(500).json({message: e.message})
    }
}

// get user profile
exports.getProfile=async (req, res)=>{
    try{
        const user = await User.findById(req.user.id)
        res.json(user)
    }
    catch(e){
        res.status(500).json({message: e.message})
    }
}
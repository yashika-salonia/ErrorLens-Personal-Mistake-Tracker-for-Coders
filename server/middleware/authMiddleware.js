const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
    try {
        let token
        // check if token is there
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // extract token
            token = req.headers.authorization.split(" ")[1]
        }
        // if no token, then reject
        if(!token) 
            return res.status(401).json({msg: "Not authorized"})
        
        // check if token is valid, expired, decodes payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select("-password")

        if(!user)
            return res.status(401).json({msg: "User not found"})
        
        req.user = user
        next()
    }catch(err) {
        console.log(err.message)
        return res.status(401).json({msg: "Invalid or expired token"})
    }
}

module.exports = { protect }
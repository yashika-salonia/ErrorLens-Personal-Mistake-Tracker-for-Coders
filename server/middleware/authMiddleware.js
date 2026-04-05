const jwt= require('jsonwebtoken')
const User=require('../models/User')

const auth= async (req, res, next)=>{
    try{
        const header=req.headers.auhorization

        if(!header || !header.startWith("Bearer")){
            return res.status(401).json({success: false, message:'No token provided. '})
        }

        const token=header.split(" ")[1]
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
        const user=await User.findById(decoded.id)

        if(!user){
            return res.status(401).json({success: false, message: 'No token - User no longer exists'})
        }

        req.user=user
        next()
    } catch(err){
        const message =
          err.name === "TokenExpiredError"
            ? "Token has expired."
            : "Invalid token.";
        res.status(401).json({ success: false, message });
    }
}

module.exports=auth
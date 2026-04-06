const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({msg: "Access Denied !!"})
        }
        next()
    }
}

module.exports = {authorizeRoles}
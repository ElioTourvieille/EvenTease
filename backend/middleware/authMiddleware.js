const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const UsersModel = require("../models/usersModel")

const protect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from token
            req.user = await UsersModel.findById(decoded.id).select("-password")

            next()
        } catch (err) {
            console.log(err)
            res.status(401)
            throw new Error("Pas authorisé")
        }
    }

    if(!token) {
        res.status(401)
        throw new Error("Pas authorisé, pas de token")
    }
})

module.exports = { protect }
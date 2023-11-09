const asyncHandler = require("express-async-handler")
const UsersModel = require("../models/usersModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler( async(req, res) => {
    const { first_name, last_name, email, password} = req.body

    if (!first_name || !last_name || !email || !password) {
        res.status(400)
        throw new Error("Merci de remplir tous les champs")
    }

    //Check if user exists
    const userExist = await UsersModel.findOne({email})
    if(userExist) {
        res.status(400)
        throw new Error("L'utilisateur existe déjà")
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create user
    const user = await UsersModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword
    })
    if (user) {
        res.status(201).json({
            _id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Données invalides")
    }

    res.json({message: "Inscription"})
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password} = req.body

    //Check for user email
    const user = await UsersModel.findOne({email})
    //Check password
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Email ou mot de passe incorrect")
    }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    const { _id, first_name, last_name, email } = await UsersModel.findById(req.user.id) // ID vient du token
    res.status(200).json({
        _id,
        first_name,
        last_name,
        email
    })
})

//  Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    } )
}

module.exports = {
    registerUser,
    loginUser,
    getUser
}
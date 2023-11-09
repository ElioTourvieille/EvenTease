const mongoose = require("mongoose")

const usersSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Merci d'entre votre nom"],
        trim: true,
        minlength: [2, "Merci de mettre un prénom de plus de 2 caractères"]
    },
    last_name: {
        type: String,
        required: [true, "Merci d'entrer votre nom"],
        trim: true,
        minlength: [2, "Merci de mettre un nom de plus de 2 caractères"]
    },
    email: {
        type: String,
        required: [true, "Merci de remplir un email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Merci d'entrer un mote de passe"]
    }
}, {timestamps: true})

module.exports = mongoose.model('Users', usersSchema)
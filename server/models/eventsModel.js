const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, "Merci d'entrer un titre"],
        trim: true,
        minlength: [2, "Merci de mettre un titre de plus de 2 caractères"]
    },
    type: {
        type: String,
        required: true,
    },
    invitation: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: [true, "Merci de sélectionner une date"],
    },
    address: {
        type: String,
        required: [true, "Merci d'entrer l'adresse de l'évènement"],
        trim: true,
        minlength: [2, "Merci de mettre une adresse de plus de 5 caractères"]
    },
    description: {
        type: String,
        trim: true,
    },
    picture: {
        type: String, // We are storing the file URL as a string
    },
    est_name: {
        type: String,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Event', eventSchema, );

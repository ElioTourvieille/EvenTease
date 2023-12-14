const asyncHandler = require("express-async-handler")
const Events = require("../models/eventsModel")
const Users = require("../models/usersModel")
const path = require("path")

// @desc Get all events
// @route GET /api/events/all
// @access Public
const getAllEvents = asyncHandler( async(req, res) => {
    const events = await Events.find();
    res.status(200).json(events)
})

// @desc Get events from user
// @route GET /api/events/
// @access Private
const getUserEvents = asyncHandler( async(req, res) => {
    const events = await Events.find({user: req.user.id});
    if(events){
        res.status(200).json(events)
    } else {
        res.status(401)
        throw new Error("Aucun évènement")
    }
})

// @desc    Create new event
// @route   POST /api/events/create
// @access  Private
const createEvent = asyncHandler( async(req, res) => {
    const {title, type, invitation, date, address, description} = req.body
    const picture = req.files
    if (!title || !date || !address || !description) {
        res.status(400)
        throw new Error("Merci de remplir tous les champs")
    }

    // Create event and save it on the database
    const newEvent = await Events.create({
        user: req.body.user,
        title,
        type,
        invitation,
        description,
        date,
        address,
        est_name: req.body.est_name,
        participants: [],
    })

    if(!newEvent){
        res.status(400)
        throw new Error("Erreur lors de la création de l'évènement, veuillez réessayer")
    } else {
        res.status(201).json(newEvent)
    }
    // add picture to the event
    await picture.mv(path.join(picturesFolder, picture.name, "layout.jpg"))
})


//@desc    Participate to event
//@route   PUT /api/events/:id/participate
//@access  Private
const participateInEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id

    if (!eventId) {
        res.status(400)
        throw new Error("L'ID de l'événement est manquant")
    }

    // Check if the event exists
    const event = await Events.findById(eventId)
    if (!event) {
        res.status(404);
        throw new Error("Évènement non trouvé")
    }

    // Check if the user exists
    const user = req.user.id
    if (!user) {
        res.status(404);
        throw new Error("Utilisateur non trouvé")
    }

    // Add the user to the event participants
    if (!event.participants || !Array.isArray(event.participants)) {
        // If the participants field is not an array, we create it
        event.participants = [];
    }

    // Now, we can push the user
    event.participants.push(user);
    // Save the modifications
    await event.save()

    res.status(200).json({message: "Participation enregistrée avec succès"});
})

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler( async(req, res) => {
    const event = await Events.findById(req.params.id)
    if(!event){
        res.status(404)
        throw new Error("Évènement non trouvé")
    }

    if(!req.user) {
        res.status(400)
        throw new Error("Utilisateur non trouvé")
    }

    if(event.user.toString() !== req.user.id.toString()){
        res.status(401)
        throw new Error("Vous n'êtes pas autorisé à modifier cet évènement")
    }

    const updatedEvent = await Events.findByIdAndUpdate(req.params.id, req.body, {new:true})

    res.status(200).json(updatedEvent)
})

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler( async(req, res) => {
    const event = await Events.findById(req.params.id)

    if(!event){
        res.status(404)
        throw new Error("Évènement non trouvé")
    }

    if(!req.user) {
        res.status(400)
        throw new Error("Utilisateur non trouvé")
    }

    if(event.user.toString() !== req.user.id.toString()){
        res.status(401)
        throw new Error("Vous n'êtes pas autorisé à supprimer cet évènement")
    }

    await Events.findByIdAndRemove(req.params.id)
    res.status(200).json({message: "Évènement supprimé"})
})

module.exports = {
    getAllEvents,
    getUserEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    participateInEvent
}
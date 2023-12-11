const asyncHandler = require("express-async-handler")
const Events = require("../models/eventsModel")
const Users = require("../models/usersModel")

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
    if (!req.body.title || !req.body.date || !req.body.address ) {
        res.status(400)
        throw new Error("Merci de remplir tous les champs")
    }

    //Create event
    const event = await Events.create({
        user: req.body.user,
        title: req.body.title,
        type: req.body.type,
        invitation: req.body.invitation,
        description: req.body.description,
        date: req.body.date,
        address: req.body.address,
        //picture: req.file.filename,
        est_name: req.body.est_name,
        participants: [],
    })

    if (event) {
        res.status(201).json(event)
    } else {
        res.status(400)
        throw new Error("Erreur lors de la création de l'évènement, veuillez réessayer")
    }
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
        // Si ce n'est pas le cas, initialisez event. participants comme un nouveau tableau vide
        event.participants = [];
    }

    // Maintenant, vous pouvez utiliser push en toute sécurité
    event.participants.push(user);
    // Save the modifications
    await event.save()

    console.log(event.participants)

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
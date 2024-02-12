const asyncHandler = require("express-async-handler")
const Events = require("../models/eventsModel")
const Users = require("../models/usersModel")
const rootPath = require("../rooPath")
const path = require("path")
const picturesFolder = path.join(rootPath, "uploads")

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
    if (!title || !date || !address || !description) {
        res.status(400)
        throw new Error("Merci de remplir tous les champs")
    }

    let image;
    if (req.file) {
        image = req.file.path;
    } else {
        image = path.join(picturesFolder, "default.jpg")
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
        image
    })

    if(!newEvent){
        res.status(400)
        throw new Error("Erreur lors de la création de l'évènement, veuillez réessayer")
    } else {
        res.status(201).json(newEvent)
    }
})

//@desc   Participate in event
//@route  PUT /api/events/:id/participate
//@access Private
const participateInEvent = asyncHandler(async (req, res) => {
    console.log('Received participate request for event ID:', req.params.id);
    const event = await Events.findById(req.params.id)
    if(!event){
        res.status(404)
        throw new Error("Évènement non trouvé")
    }
    if (!event.participants.includes(req.user._id)) {
        event.participants.push(req.user._id)
    } else {
        event.participants = event.participants.filter(id => id.toString() !== req.user._id.toString())
    }
    const updatedEvent = await event.save()

    if (!updatedEvent) {
        res.status(500)
        throw new Error("Erreur lors de la mise à jour de l'événement")
    }

    res.status(200).json(updatedEvent)
} )

//@desc Unsubscribe from event
//@route DELETE /api/events/:id/unsubscribe
//@access Private
const unsubscribeFromEvent = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString()

    try{
        const event = await Events.findById(req.params.id)
        if(!event){
            res.status(404)
            throw new Error("Évènement non trouvé")
        }

       const userIndex = event.participants.indexOf(userId)
        if(userIndex === -1){
            res.status(404)
            throw new Error("Vous n'êtes pas inscrit à cet évènement")
        }

        event.participants.splice(userIndex, 1)
        await event.save()

        res.status(200).json({ message: "Vous avez été désinscrit de l'évènement" })
    } catch(err){
        res.status(500).json({ message: "Erreur lors de la désinscription" })
    }
} )

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

//@desc Count events
//@route GET /api/events/count
//@access Public
const getEventCount = asyncHandler(async (req, res) => {
    try{
        const count = await Events.countDocuments()
        res.status(200).json({ count })
    } catch(err){
        res.status(500).json({ message: 'Erreur lors de la récupération du nombre d\'évènements' })
    }
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
    participateInEvent,
    unsubscribeFromEvent,
    getEventCount
}
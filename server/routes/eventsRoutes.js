const express = require("express");
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require("../middleware/authMiddleware")
const { getAllEvents, getUserEvents, participateInEvent, createEvent, updateEvent, deleteEvent, getEventCount,
    unsubscribeFromEvent
} = require("../controllers/eventsController")

router.get("/all", getAllEvents)
router.get("/event", getUserEvents)
router.post("/create", createEvent)
router.put("/:id/participate", protect, participateInEvent)
router.put("/:id", updateEvent)
router.delete("/:id/unsubscribe", protect, unsubscribeFromEvent)
router.get("/count", getEventCount)
router.delete("/:id", protect, deleteEvent)

router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    res.status(200).json({message: "File uploaded successfully", destination: '../uploads/' + req.file.filename});
});

module.exports = router
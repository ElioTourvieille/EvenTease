const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware")
const { getAllEvents, getUserEvents, participateInEvent, createEvent, updateEvent, deleteEvent } = require("../controllers/eventsController")

router.get("/all", getAllEvents)
router.get("/event", getUserEvents)
router.post("/create", createEvent)
router.post("/:id/participate", protect, participateInEvent)
router.put("/:id", updateEvent)
router.delete("/:id",  deleteEvent)

module.exports = router
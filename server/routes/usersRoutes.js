const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser, updateUser, getUserCount} = require("../controllers/usersController")
const { protect } = require("../middleware/authMiddleware")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/me", protect, getUser)
router.put("/me", protect, updateUser)
router.get('/count', getUserCount)

module.exports = router
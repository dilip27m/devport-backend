const express = require("express");
const router = express.Router();

// Import both controller functions now
const { registerUser, loginUser } = require("../controllers/authController");

// This route handles new user registration
router.post("/register", registerUser);

// --- NEW ROUTE ---
// This route will handle user login
router.post("/login", loginUser);

module.exports = router;
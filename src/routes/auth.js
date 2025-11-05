const express = require("express");
const router = express.Router();

// Import both controller functions now
const {
  registerUser,
  loginUser,
  updatePassword, // <-- Import updatePassword
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes,hanldes regristation and login
router.post("/register", registerUser);
router.post("/login", loginUser);

// --- NEW PROTECTED ROUTE ---
// 2. This route will handle password updates. It is a PUT request because we are updating.
//    Crucially, we add the `protect` middleware before the controller function.
router.put("/update-password", protect, updatePassword);
module.exports = router;
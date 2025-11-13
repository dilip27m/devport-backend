const express = require("express");
const router = express.Router();

// All the necessary controller functions are already imported, no changes here.
const {
  registerUser,
  loginUser,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// The protect middleware is also correctly imported.
const { protect } = require("../middleware/authMiddleware");

//=============================================================================
// PUBLIC ROUTES (No authentication required)
//=============================================================================

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate a user and get a token
router.post("/login", loginUser);

// @route   POST /api/auth/forgot-password
// @desc    Initiate the password reset process by sending an email
router.post("/forgot-password", forgotPassword);


// --- THIS ROUTE HAS BEEN UPDATED ---
// @route   PUT /api/auth/reset-password
// @desc    Reset the user's password using the 6-digit code from the email
// It no longer takes a token from the URL.
router.put("/reset-password", resetPassword);
// -----------------------------------


//=============================================================================
// PROTECTED ROUTES (Authentication required - valid JWT must be provided)
//=============================================================================

// @route   PUT /api/auth/update-password
// @desc    Update the password for the currently logged-in user
router.put("/update-password", protect, updatePassword);

module.exports = router;
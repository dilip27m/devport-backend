const express = require("express");
const router = express.Router();

// Import all the necessary controller functions
const {
  registerUser,
  loginUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  deleteAccount, // The new function for deleting an account
} = require("../controllers/authController");

// Import our middleware for protecting routes
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

// @route   PUT /api/auth/reset-password
// @desc    Reset the user's password using the 6-digit code
router.put("/reset-password", resetPassword);


//=============================================================================
// PROTECTED ROUTES (Authentication required - valid JWT must be provided)
//=============================================================================

// @route   PUT /api/auth/update-password
// @desc    Update the password for the currently logged-in user
router.put("/update-password", protect, updatePassword);

// @route   DELETE /api/auth/delete-account
// @desc    Delete the currently logged-in user's account and data
router.delete("/delete-account", protect, deleteAccount);


module.exports = router;
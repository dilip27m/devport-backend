const express = require("express");
const router = express.Router();
const {
  savePortfolio,
  getPortfolio,
} = require("../controllers/portfolioController");

// 1. Import our new 'protect' middleware
const { protect } = require("../middleware/authMiddleware");

// 2. Apply the middleware to the routes
// Now, when a request is made to these endpoints, the 'protect' function will run first.
// If the user's token is valid, `req.user` will be available in the controller.
// If the token is invalid, the middleware will send an error and the controller will never run.

// Protects POST /api/portfolio
router.post("/", protect, savePortfolio);

// Protects GET /api/portfolio/:userId
// Note: While we could get the userId from the URL, it's more secure
// to get it from the validated token to ensure users can only fetch their own data.
// We will adjust the controller for this in the next step.
router.get("/:userId", protect, getPortfolio);


module.exports = router;
const express = require("express");
const router = express.Router();

// 1. Import the new controller functions
const {
  savePortfolio,
  getPortfolio,
  publishPortfolio,   // <-- Import new
  unpublishPortfolio, // <-- Import new
} = require("../controllers/portfolioController");

// The protect middleware is correctly imported
const { protect } = require("../middleware/authMiddleware");


// This route handles saving/updating portfolio data.
// @route POST /api/portfolio
router.post("/", protect, savePortfolio);

// This route handles fetching the logged-in user's portfolio data for the editor.
// @route GET /api/portfolio/:userId (the userId param is ignored for security)
router.get("/:userId", protect, getPortfolio);


// --- NEW PROTECTED ROUTES ---

// @route PUT /api/portfolio/publish
// @desc Sets the user's portfolio to be public
router.put("/publish", protect, publishPortfolio);

// @route PUT /api/portfolio/unpublish
// @desc Sets the user's portfolio to be private
router.put("/unpublish", protect, unpublishPortfolio);
// ----------------------------


module.exports = router;
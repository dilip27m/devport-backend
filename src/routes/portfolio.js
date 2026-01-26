const express = require("express");
const router = express.Router();

const {
  savePortfolio,
  getPortfolio,
  getAllPortfolios,
  publishPortfolio,
  unpublishPortfolio,
  deletePortfolio,
} = require("../controllers/portfolioController");

const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/portfolio
// @desc    Get all portfolios for logged-in user
router.get("/", protect, getAllPortfolios);

// @route   GET /api/portfolio/:portfolioId
// @desc    Get a specific portfolio by ID
router.get("/:portfolioId", protect, getPortfolio);

// @route   POST /api/portfolio
// @desc    Create a new portfolio
router.post("/", protect, savePortfolio);

// @route   PUT /api/portfolio/:portfolioId
// @desc    Update an existing portfolio
router.put("/:portfolioId", protect, savePortfolio);

// @route   PUT /api/portfolio/:portfolioId/publish
// @desc    Publish a specific portfolio (unpublishes others)
router.put("/:portfolioId/publish", protect, publishPortfolio);

// @route   PUT /api/portfolio/:portfolioId/unpublish
// @desc    Unpublish a specific portfolio
router.put("/:portfolioId/unpublish", protect, unpublishPortfolio);

// @route   DELETE /api/portfolio/:portfolioId
// @desc    Delete a specific portfolio
router.delete("/:portfolioId", protect, deletePortfolio);

module.exports = router;
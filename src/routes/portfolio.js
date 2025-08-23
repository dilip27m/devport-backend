const express = require("express");
const router = express.Router();
const {
  savePortfolio,
  getPortfolio,
} = require("../controllers/portfolioController");

// This route will handle saving and updating the portfolio data.
// It points to POST http://localhost:5000/api/portfolio
router.post("/", savePortfolio);

// This route will handle fetching a portfolio's data by their ID.
// It points to GET http://localhost:5000/api/portfolio/someUserId
router.get("/:userId", getPortfolio);

module.exports = router;
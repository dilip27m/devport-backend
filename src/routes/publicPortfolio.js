const express = require("express");
const router = express.Router();
const { getPublicPortfolio } = require("../controllers/portfolioController");

// This route will handle fetching a public portfolio by username.
// It maps to GET http://localhost:5000/api/public/portfolio/some-username
router.get("/:username", getPublicPortfolio);

module.exports = router;
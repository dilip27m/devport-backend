const Portfolio = require("../models/Portfolio");

// @desc    Save or update a user's portfolio data
// @route   POST /api/portfolio
// @access  Private (will be later)
exports.savePortfolio = async (req, res) => {
  // We get the user's ID and the portfolio data from the request body
  const { userId, data } = req.body;

  // Basic validation
  if (!userId || !data) {
    return res.status(400).json({ success: false, error: "User ID and data are required." });
  }

  try {
    // Find a portfolio by userId and update it with the new data.
    // 'upsert: true' means if no document is found, a new one will be created.
    // 'new: true' means the function will return the updated document.
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: userId },
      { data: data, lastUpdatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error("Error saving portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get a user's portfolio data
// @route   GET /api/portfolio/:userId
// @access  Public
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });

    if (!portfolio) {
      return res.status(404).json({ success: false, error: "Portfolio not found." });
    }

    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error("Error getting portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
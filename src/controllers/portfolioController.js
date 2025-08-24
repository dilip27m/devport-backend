const Portfolio = require("../models/Portfolio");

// @desc    Save or update the logged-in user's portfolio data
// @route   POST /api/portfolio
// @access  Private (Protected)
exports.savePortfolio = async (req, res) => {
  // We no longer need userId from the body. We get it from the middleware.
  const { data } = req.body;
  const userId = req.user._id; // <-- The user ID comes from the authenticated user

  if (!data) {
    return res.status(400).json({ success: false, error: "Portfolio data is required." });
  }

  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: userId }, // Find the portfolio by the LOGGED-IN user's ID
      { data: data, lastUpdatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error("Error saving portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get the logged-in user's portfolio data
// @route   GET /api/portfolio/:userId (the userId param is now optional)
// @access  Private (Protected)
exports.getPortfolio = async (req, res) => {
  try {
    // We ignore the URL parameter and use the ID from the authenticated user.
    // This is a key security measure.
    const portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      // This is not an error, it just means a new user doesn't have a portfolio yet.
      return res.status(404).json({ success: false, error: "Portfolio not found for this user." });
    }

    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error("Error getting portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
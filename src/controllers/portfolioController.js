const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

// --- UPDATED SAVE FUNCTION ---
exports.savePortfolio = async (req, res) => {
  // Get `template` from the body
  const { data, template } = req.body;
  const userId = req.user._id;

  if (!data || !template) {
    return res.status(400).json({ success: false, error: "Data and template are required." });
  }

  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: userId },
      // Save the `template` along with the `data`
      { data: data, template: template, lastUpdatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error("Error saving portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// --- UPDATED PROTECTED GET FUNCTION ---
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: "Portfolio not found for this user." });
    }
    // Return the full portfolio object, including the template
    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error("Error getting portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// --- UPDATED PUBLIC GET FUNCTION ---
exports.getPublicPortfolio = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) { return res.status(404).json({ success: false, error: "Portfolio not found." }); }

    const portfolio = await Portfolio.findOne({ userId: user._id });
    if (!portfolio) { return res.status(404).json({ success: false, error: "Portfolio not found." }); }

    // Return an object containing both the data and the template name
    res.status(200).json({
      success: true,
      portfolio: {
        data: portfolio.data,
        template: portfolio.template,
      },
    });
  } catch (err) {
    console.error("Error getting public portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
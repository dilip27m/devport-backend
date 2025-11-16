const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

// --- THIS FUNCTION HAS BEEN UPDATED FOR ROBUSTNESS ---
exports.savePortfolio = async (req, res) => {
  const { data, template } = req.body;
  const userId = req.user._id;

  if (!data || !template) {
    return res.status(400).json({ success: false, error: "Data and template are required." });
  }

  try {
    // We use findOneAndUpdate, which is perfect for our "create or update" logic.
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: userId }, // The condition to find the document
      { // The data to update with. We use $set to be explicit.
        $set: {
          data: data,
          template: template,
          lastUpdatedAt: Date.now(),
        },
        // This `$setOnInsert` operator is a safeguard. It says: "ONLY if you are
        // creating a NEW document (upsert: true), set isPublished to false."
        // This prevents an existing published portfolio from accidentally being set to private on a normal save.
        $setOnInsert: {
          isPublished: false,
        }
      },
      { // Options
        new: true, // Return the modified document instead of the original
        upsert: true, // If no document is found, create a new one
        runValidators: true, // Ensure our model's validation rules are run
        setDefaultsOnInsert: true, // Ensure our model's default values (like for isPublished) are set
      }
    );
    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error("Error saving portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
// --------------------------------------------------------

// This function is correct and does not need changes.
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: "Portfolio not found for this user." });
    }
    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error("Error getting portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// This function is correct and does not need changes.
exports.getPublicPortfolio = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, error: "Portfolio not found." });
    }
    const portfolio = await Portfolio.findOne({ userId: user._id });
    if (!portfolio || !portfolio.isPublished) {
      return res.status(404).json({ success: false, error: "Portfolio not found." });
    }
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

// This function is correct and does not need changes.
exports.publishPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: "Portfolio not found." });
    }
    portfolio.isPublished = true;
    await portfolio.save();
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Publish Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// This function is correct and does not need changes.
exports.unpublishPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: "Portfolio not found." });
    }
    portfolio.isPublished = false;
    await portfolio.save();
    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Unpublish Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

/**
 * @desc    Create a new portfolio or update an existing one
 * @route   POST /api/portfolio (create) or PUT /api/portfolio/:portfolioId (update)
 * @access  Private
 */
exports.savePortfolio = async (req, res) => {
  const { data, template, title } = req.body;
  const userId = req.user._id;
  const portfolioId = req.params.portfolioId; // Will be undefined for POST (create)

  if (!data || !template) {
    return res.status(400).json({ success: false, error: "Data and template are required." });
  }

  try {
    let portfolio;

    if (portfolioId) {
      // UPDATE: Find and update specific portfolio
      portfolio = await Portfolio.findOneAndUpdate(
        { _id: portfolioId, userId: userId }, // Ensure user owns this portfolio
        {
          $set: {
            data: data,
            template: template,
            title: title || undefined, // Only update title if provided
            lastUpdatedAt: Date.now(),
          },
        },
        { new: true, runValidators: true }
      );

      if (!portfolio) {
        return res.status(404).json({ success: false, error: "Portfolio not found or access denied." });
      }
    } else {
      // CREATE: Create a new portfolio
      portfolio = await Portfolio.create({
        userId: userId,
        data: data,
        template: template,
        title: title || 'My Portfolio',
        isPublished: false,
        lastUpdatedAt: Date.now(),
      });
    }

    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error("Error saving portfolio:", err);
    // Handle duplicate key error (legacy unique index on userId may still exist)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Duplicate portfolio error. You may need to drop the old unique index on userId."
      });
    }
    res.status(500).json({ success: false, error: err.message || "Server Error" });
  }
};

/**
 * @desc    Get a specific portfolio by ID
 * @route   GET /api/portfolio/:portfolioId
 * @access  Private
 */
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.portfolioId,
      userId: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({ success: false, error: "Portfolio not found." });
    }

    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error("Error getting portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * @desc    Get all portfolios for the logged-in user
 * @route   GET /api/portfolio
 * @access  Private
 */
exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user._id })
      .select('_id title template lastUpdatedAt isPublished')
      .sort({ lastUpdatedAt: -1 });

    res.status(200).json({ success: true, data: portfolios });
  } catch (err) {
    console.error("Error getting portfolios:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * @desc    Get the public portfolio for a username
 * @route   GET /api/public-portfolio/:username
 * @access  Public
 */
exports.getPublicPortfolio = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, error: "Portfolio not found." });
    }

    // Find the published portfolio for this user
    const portfolio = await Portfolio.findOne({ userId: user._id, isPublished: true });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: "Portfolio not found." });
    }

    res.status(200).json({
      success: true,
      portfolio: {
        data: portfolio.data,
        template: portfolio.template,
        title: portfolio.title,
      },
    });
  } catch (err) {
    console.error("Error getting public portfolio:", err.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * @desc    Publish a specific portfolio (and unpublish all others)
 * @route   PUT /api/portfolio/:portfolioId/publish
 * @access  Private
 */
exports.publishPortfolio = async (req, res) => {
  const userId = req.user._id;
  const portfolioId = req.params.portfolioId;

  try {
    // First, verify the portfolio exists and belongs to the user
    const portfolio = await Portfolio.findOne({ _id: portfolioId, userId: userId });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: "Portfolio not found." });
    }

    // Unpublish ALL portfolios for this user first
    await Portfolio.updateMany(
      { userId: userId },
      { $set: { isPublished: false } }
    );

    // Now publish the specific portfolio
    portfolio.isPublished = true;
    await portfolio.save();

    res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    console.error("Publish Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * @desc    Unpublish a specific portfolio
 * @route   PUT /api/portfolio/:portfolioId/unpublish
 * @access  Private
 */
exports.unpublishPortfolio = async (req, res) => {
  const userId = req.user._id;
  const portfolioId = req.params.portfolioId;

  try {
    const portfolio = await Portfolio.findOne({ _id: portfolioId, userId: userId });
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

/**
 * @desc    Delete a specific portfolio
 * @route   DELETE /api/portfolio/:portfolioId
 * @access  Private
 */
exports.deletePortfolio = async (req, res) => {
  const userId = req.user._id;
  const portfolioId = req.params.portfolioId;

  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: portfolioId,
      userId: userId,
    });

    if (!portfolio) {
      return res.status(404).json({ success: false, error: "Portfolio not found." });
    }

    res.status(200).json({ success: true, message: "Portfolio deleted successfully." });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
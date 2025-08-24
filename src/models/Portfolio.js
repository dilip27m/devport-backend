const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  // --- NEW FIELD ---
  // Store the name of the template the user has selected.
  template: {
    type: String,
    required: true,
    default: 'template1', // Default to template1 for new portfolios
  },
  // -----------------

  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
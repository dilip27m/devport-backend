const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // Removed unique: true to allow multiple portfolios per user
  },

  title: {
    type: String,
    required: true,
    default: 'My Portfolio',
    trim: true,
  },

  template: {
    type: String,
    required: true,
    default: 'template1',
  },

  isPublished: {
    type: Boolean,
    default: false,
  },

  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },

  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries - find all portfolios for a user
PortfolioSchema.index({ userId: 1, lastUpdatedAt: -1 });

// Index for finding the published portfolio for a user
PortfolioSchema.index({ userId: 1, isPublished: 1 });

module.exports = mongoose.model("Portfolio", PortfolioSchema);
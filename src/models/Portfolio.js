const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  template: {
    type: String,
    required: true,
    default: 'template1',
  },

  // --- THIS IS THE FIX ---
  // We must add the `isPublished` field to the schema.
  isPublished: {
    type: Boolean,
    default: false, // This ensures every new portfolio is private by default.
  },
  // -----------------------

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
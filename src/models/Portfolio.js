const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  // This will link the portfolio to a specific user (once you have authentication)
  // We will use a placeholder for now, but this is crucial for the future.
  userId: {
    type: String, // In the future, this will be: mongoose.Schema.Types.ObjectId, ref: 'User'
    required: true,
    unique: true, // Each user should only have one portfolio data document
  },

  // This will store the entire JSON object from the frontend editor.
  // Using 'Mixed' type gives us the flexibility to store any structure,
  // which is perfect for our editor's data object.
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
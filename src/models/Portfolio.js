const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  // This field now correctly links to the User model's unique _id
  userId: {
    type: mongoose.Schema.Types.ObjectId, // This is MongoDB's special ID type
    ref: 'User', // This creates an official link to the User collection
    required: true,
    unique: true,
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

module.exports = mongoose.model("Portfolio", PortfolioSchema);
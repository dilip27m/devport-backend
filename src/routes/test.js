const express = require("express");
const Test = require("../models/Test");
const router = express.Router();

// Save a test record
router.post("/", async (req, res) => {
  try {
    const test = new Test({ name: req.body.name });
    await test.save();
    res.json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch all test records
router.get("/", async (req, res) => {
  try {
    const tests = await Test.find();
    res.json({ success: true, tests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

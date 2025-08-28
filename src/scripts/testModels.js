const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables (like your MONGO_URI)
dotenv.config({ path: "./.env" });

// Import the models we want to test
const User = require("../models/User");
const Portfolio = require("../models/Portfolio");

// --- The Main Test Function ---
const runTest = async () => {
  try {
    // 1. Connect to the database
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
    console.log("------------------------------------");

    // 2. Create a new User instance
    console.log("Creating a new test user...");
    const testUser = new User({
      username: "testuser",
      name: "Test User",
      email: "test@example.com",
      password: "password123", // We provide a plain password
    });

    // 3. Save the user to the database
    const savedUser = await testUser.save();
    console.log("✅ User saved successfully!");
    console.log("User's ID:", savedUser._id);
    console.log("Hashed Password (should not be 'password123'):", savedUser.password); // This will be undefined because of `select: false`
    console.log("------------------------------------");

    // 4. Create a new Portfolio instance, linked to the user
    console.log("Creating a new portfolio linked to the user...");
    const testPortfolio = new Portfolio({
      userId: savedUser._id, // Use the unique _id from the user we just saved
      data: {
        profile: {
          name: "Test User",
          bio: "This is a bio from the test script."
        },
        projects: []
      }
    });

    // 5. Save the portfolio
    const savedPortfolio = await testPortfolio.save();
    console.log("Portfolio saved successfully!");
    console.log("Portfolio linked to userId:", savedPortfolio.userId);
    console.log("------------------------------------");

    console.log("All model tests passed successfully!");

  } catch (error) {
    console.error(" A test failed!");
    console.error(error);
  } finally {
    // 6. Disconnect from the database when done
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

// Run the test
runTest();
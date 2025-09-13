const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cloudinary = require("cloudinary").v2;

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// --- Cloudinary Configuration ---
//  Configures the Cloudinary library with your credentials from the .env file.
//  This needs to be done once when the server starts.
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// --- Core Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) for all routes.
// This is essential for allowing your frontend (on localhost:3000) to communicate with your backend (on localhost:5000 0r 5001).
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));


// --Middleware to parse JSON request bodies --
// Enable the Express app to parse JSON formatted request bodies.
// This is necessary for handling POST/PUT requests with a JSON payload.
app.use(express.json());

// --- Database Connection ---
// Call the connectDB function to establish a connection with your MongoDB Atlas cluster.
connectDB();


// --- API Routes ---
// Import all the different router files for the application.
const authRoutes = require("./routes/auth");
const portfolioRoutes = require("./routes/portfolio");
const publicPortfolioRoutes = require("./routes/publicPortfolio");
const uploadRoutes = require("./routes/upload");

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/public/portfolio", publicPortfolioRoutes);
app.use("/api/upload", uploadRoutes);

// --- Server Initialization ---
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
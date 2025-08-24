const express = require("express");
const dotenv = require("dotenv");
const cors =require("cors");
const connectDB = require("./config/db");
const cloudinary = require("cloudinary").v2; // Import Cloudinary

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();


// --- Cloudinary Configuration ---
// Configures the Cloudinary library with your credentials from the .env file.
// This needs to be done once when the server starts.
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
// --------------------------------


// --- Core Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) for all routes.
// This is essential for allowing your frontend (on localhost:3000) to communicate with your backend (on localhost:5000).
app.use(cors());

// Enable the Express app to parse JSON formatted request bodies.
// This is necessary for handling POST/PUT requests with a JSON payload.
app.use(express.json());
// ---------------------


// --- Database Connection ---
// Call the connectDB function to establish a connection with your MongoDB Atlas cluster.
connectDB();
// -------------------------


// --- API Routes ---
// Import all the different router files for the application.
const authRoutes = require("./routes/auth");
const portfolioRoutes = require("./routes/portfolio");
const publicPortfolioRoutes = require("./routes/publicPortfolio");
const uploadRoutes = require("./routes/upload");
const testRoutes = require("./routes/test");


// Mount the routers on their specific base paths.
// For example, any request to "/api/auth/..." will be handled by the authRoutes router.
app.use("/api/auth", authRoutes); // For user registration and login.
app.use("/api/portfolio", portfolioRoutes); // For saving and loading portfolio data (protected).
app.use("/api/public/portfolio", publicPortfolioRoutes); // For fetching public portfolio data.
app.use("/api/upload", uploadRoutes); // For getting Cloudinary upload signatures (protected).
app.use("/api/test", testRoutes); // Your original test route.
// ------------------


// --- Server Initialization ---
// Get the port number from environment variables, defaulting to 5000.
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests on the specified port.
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// ---------------------------
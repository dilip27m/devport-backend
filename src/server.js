const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// --- Routes ---
const authRoutes = require("./routes/auth");
const portfolioRoutes = require("./routes/portfolio");
const testRoutes = require("./routes/test");
// 1. Import the new public route file
const publicPortfolioRoutes = require("./routes/publicPortfolio");

// Tell the app to use the imported routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes); // These are the protected routes for the editor
app.use("/api/test", testRoutes);
// 2. Tell the app to use the new public routes
app.use("/api/public/portfolio", publicPortfolioRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
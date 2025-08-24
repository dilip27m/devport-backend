const jwt = require("jsonwebtoken");
const User = require("../models/User");

// This middleware will protect routes that require a logged-in user
const protect = async (req, res, next) => {
  let token;

  // 1. Check if the request headers contain an 'Authorization' header and if it starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Get the token from the header (it's in the format "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Use the ID from the token to find the user in the database.
      // We exclude the password from the user object we get back.
      req.user = await User.findById(decoded.id).select("-password");

      // 5. If the user is found, call the next middleware/controller in the chain
      next();

    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ success: false, error: "Not authorized, token failed" });
    }
  }

  // If there's no token at all, send an error
  if (!token) {
    res.status(401).json({ success: false, error: "Not authorized, no token" });
  }
};

module.exports = { protect };
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  registerUser,
  loginUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
  sendOtp,
  verifyOtp
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Rate Limiters
const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  message: { success: false, error: "Too many OTP requests. Wait 1 minute." }
});

const verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, error: "Too many OTP attempts. Try again later." }
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, error: "Too many reset attempts. Try again in 1 hour." }
});

// Routes
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtpLimiter, verifyOtp);

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.put("/reset-password", resetPassword);

router.put("/update-password", protect, updatePassword);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;

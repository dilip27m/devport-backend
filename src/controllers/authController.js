const User = require("../models/User");
const Portfolio = require("../models/Portfolio"); // <-- We need the Portfolio model
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail"); 
const crypto = require("crypto"); 


exports.registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }
    const user = await User.create({ name, username, email, password });
    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ success: false, error: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginIdentifier = email.toLowerCase();
    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
    }).select("+password");
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};


exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: "Please provide both current and new passwords." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, error: "New password must be at least 6 characters long." });
  }
  try {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Incorrect current password" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: "Email sent if a user with that email exists." });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Your password reset code is:</p>
      <h2 style="font-size: 24px; letter-spacing: 2px;">${resetToken}</h2>
      <p>This code will expire in 10 minutes.</p>
    `;
    await sendEmail({
      email: user.email,
      subject: "DevPort - Your Password Reset Code",
      html: message,
    });
    res.status(200).json({ success: true, message: "Email sent if a user with that email exists." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    if (user) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetCode, email, password } = req.body;
  if (!resetCode || !email || !password) {
      return res.status(400).json({ success: false, error: "Please provide email, reset code, and a new password." });
  }
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    const user = await User.findOne({
      email: email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid or expired reset code" });
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// --- NEW FUNCTION: DELETE ACCOUNT ---
// @desc    Delete user account and all associated data
// @route   DELETE /api/auth/delete-account
// @access  Private (Protected)
exports.deleteAccount = async (req, res) => {
  try {
    // The `protect` middleware gives us the ID of the logged-in user
    const userId = req.user._id;

    // First, delete the user's associated portfolio data to prevent orphans.
    await Portfolio.deleteOne({ userId: userId });

    // Then, delete the user document itself.
    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: "Account deleted successfully." });

  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
// ------------------------------------
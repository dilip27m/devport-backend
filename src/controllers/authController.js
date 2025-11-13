const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail"); // For sending the reset email
const crypto = require("crypto"); // For generating and hashing the reset token

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
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

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
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
      res.status(401).json({ success: false, error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Private (Protected)
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

// --- UPDATED FORGOT PASSWORD CONTROLLER ---
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: "Email sent if a user with that email exists." });
    }

    // This now returns a 6-digit code, e.g., "123456"
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // The reset URL is no longer needed. We create a new, simpler email message.
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
    // Safety net to clear token fields in case of an unexpected error
    if (user) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// --- UPDATED RESET PASSWORD CONTROLLER ---
exports.resetPassword = async (req, res) => {
  // Get the 6-digit code and user's email from the request BODY now
  const { resetCode, email, password } = req.body;
  
  if (!resetCode || !email || !password) {
      return res.status(400).json({ success: false, error: "Please provide email, reset code, and a new password." });
  }

  try {
    // Hash the incoming 6-digit code so we can find it in the database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    // Find the user by their email, the hashed token, and check if the token has expired.
    // This is more secure as it ensures the code is for the correct user.
    const user = await User.findOne({
      email: email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid or expired reset code" });
    }

    // If the token is valid, set the new password
    user.password = password;
    
    // Clear the reset token fields so it can't be used again
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save the user. The `pre-save` hook will hash the new password.
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
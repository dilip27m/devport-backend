const User = require("../models/User");
const Portfolio = require("../models/Portfolio");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail"); 
const OTP = require("../models/OTP");
const crypto = require("crypto"); 

exports.registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Check if OTP is verified
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ success: false, error: "Email not verified. Please verify OTP." });
    }

    // OTP must not be expired
    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, error: "OTP expired. Please request a new one." });
    }

    // Clean OTP after verification
    await OTP.deleteOne({ email });

    // Check if email/username already taken (safety check)
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const user = await User.create({ name, username, email, password });

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

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    await Portfolio.deleteOne({ userId: userId });
    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// --- UPDATED Send OTP Function ---
exports.sendOtp = async (req, res) => {
  try {
    const { email, username } = req.body;

    // 1. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // ERROR FIX: Changed 'message' to 'error' so frontend sees it
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    // 2. Check if EMAIL is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // ERROR FIX: Changed 'message' to 'error'
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    // 3. NEW: Check if USERNAME is already taken (if provided)
    if (username) {
      // Case-insensitive check for username
      const existingUsername = await User.findOne({ 
        username: { $regex: new RegExp(`^${username}$`, "i") } 
      });
      if (existingUsername) {
        return res.status(400).json({ success: false, error: "Username is already taken" });
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP (expires in 5 minutes)
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt: Date.now() + 5 * 60 * 1000 },
      { upsert: true }
    );

    // Email content
    const message = `
       <h2>Your DevPort Verification Code</h2>
       <p>Your OTP is:</p>
       <h1>${otp}</h1>
       <p>This code is valid for 5 minutes.</p>
    `;

    // Send email
    await sendEmail({
      email,
      subject: "DevPort Email Verification Code",
      html: message,
    });

    // SUCCESS: Keep 'message' here as frontend usually looks for success messages in 'message'
    return res.status(200).json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.error("Send OTP Error:", error);
    // ERROR FIX: Changed 'message' to 'error'
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

// --- UPDATED Verify OTP Function ---
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email });

    if (!record) {
      // ERROR FIX: Changed 'message' to 'error'
      return res.status(400).json({ success: false, error: "OTP not found" });
    }

    if (record.expiresAt < Date.now()) {
      // ERROR FIX: Changed 'message' to 'error'
      return res.status(400).json({ success: false, error: "OTP expired" });
    }

    if (record.otp !== otp) {
      // ERROR FIX: Changed 'message' to 'error'
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    return res.status(200).json({ success: true, message: "OTP verified" });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    // ERROR FIX: Changed 'message' to 'error'
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
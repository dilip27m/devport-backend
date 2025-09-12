const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  // ... (the registration code we already wrote is perfect)
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


// --- NEW FUNCTION STARTS HERE ---

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  // 1. Get the email and password from the request body
  const { email, password } = req.body;

  try {
    // 2. Find the user in the database by their email.
    // We use .select('+password') because we need to get the hashed password
    // for comparison, even though it's excluded by default in our model.
    const user = await User.findOne({ email }).select("+password");

    // 3. Check if the user exists AND if the passwords match.
    // We use our custom `matchPassword` method from the User model.
    if (user && (await user.matchPassword(password))) {
      // 4. If everything is correct, generate a new token
      const token = generateToken(user._id);

      // 5. Send the success response back
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
      // If user not found or password doesn't match, send an error
      res.status(401).json({ success: false, error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};


exports.updatePassword = async (req, res) => {
  // 1. Get the current and new passwords from the request body
  const { currentPassword, newPassword } = req.body;

  // Basic validation
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: "Please provide both current and new passwords." });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, error: "New password must be at least 6 characters long." });
  }

  try {
    // 2. The `protect` middleware has already found the user and attached it to `req.user`.
    //    We need to find them again, but this time select the password field.
    const user = await User.findById(req.user._id).select("+password");

    // This should theoretically never happen if the user has a valid token, but it's a good safety check.
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 3. Use our model's method to verify the current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Incorrect current password" });
    }

    // 4. If the current password is correct, set the new password
    user.password = newPassword;

    // 5. Save the user. This is crucial because it will trigger our 'pre-save' hook,
    //    which automatically hashes the new password before saving it.
    await user.save();

    // 6. Send back a success response
    res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

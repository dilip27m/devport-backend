const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
    match: [/^[a-zA-Z0-9-]+$/, "Username can only contain letters, numbers, and hyphens"],
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true
});

// This pre-save hook for hashing the main password remains unchanged.
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This method for comparing passwords during login remains unchanged.
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- THIS METHOD HAS BEEN UPDATED ---
UserSchema.methods.getResetPasswordToken = function () {
  // Generate a 6-digit code instead of a random string
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

  // The rest of the logic is the same: Hash the token for secure storage.
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration time (10 minutes from now).
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return the UN-HASHED 6-digit code. This is what we will email to the user.
  return resetToken;
};
// ------------------------------------

module.exports = mongoose.model("User", UserSchema);


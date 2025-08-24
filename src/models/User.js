const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  // New field for the public URL and profile identifier
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
    // Regex to allow only letters, numbers, and single hyphens
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

}, {
  timestamps: true
});


// (The pre-save hook and matchPassword method remain exactly the same)

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", UserSchema);
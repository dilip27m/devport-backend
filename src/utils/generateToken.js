const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  // jwt.sign() creates the token.
  // The first argument is the "payload" - the data we want to store in the token.
  // The second argument is the "secret" - a private key stored on the server.
  // The third argument is the options, like the expiration time.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // The token will be valid for 30 days
  });
};

module.exports = generateToken;
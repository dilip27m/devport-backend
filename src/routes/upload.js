const express = require("express");
const router = express.Router();
const { getUploadSignature } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");

// This route will generate the signature.
// It is PROTECTED, meaning only a logged-in user can get permission to upload.
router.get("/signature", protect, getUploadSignature);

module.exports = router;
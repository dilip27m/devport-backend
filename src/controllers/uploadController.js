const cloudinary = require("cloudinary").v2;

// @desc    Generate a secure signature for direct client-side uploads
// @route   GET /api/upload/signature
// @access  Private (Protected)
exports.getUploadSignature = (req, res) => {
  // The timestamp is required for the signature's validity period
  const timestamp = Math.round(new Date().getTime() / 1000);

  try {
    // Use the Cloudinary library to create the signature
    // This uses your API Secret behind the scenes, so it's secure
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    // Send the signature, timestamp, and your API key back to the frontend
    // The frontend will need all three to make the direct upload.
    res.status(200).json({
      success: true,
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
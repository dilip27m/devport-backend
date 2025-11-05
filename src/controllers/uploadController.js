const cloudinary = require("cloudinary").v2;

// @desc    Generate a secure signature for direct client-side uploads
// @route   GET /api/upload/signature
// @access  Private (Protected)
exports.getUploadSignature = (req, res) => {
  // The timestamp is required for the signature's validity period
  const timestamp = Math.round(Date.now() / 1000);

  try {
    // --- Safeguard: check server time drift ---
    const currentUtc = Math.round(new Date().getTime() / 1000);
    const drift = Math.abs(currentUtc - timestamp);

    if (drift > 300) { // 300s = 5 minutes
      console.warn(
        `⚠️ Server clock drift detected: ${drift} seconds difference from UTC. ` +
        `Cloudinary uploads may fail if drift exceeds allowed tolerance.`
      );
    }

    // Use the Cloudinary library to create the signature
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    // Send the signature, timestamp, apiKey, and cloudName back to the frontend
    return res.status(200).json({
      success: true,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

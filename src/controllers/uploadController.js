const cloudinary = require("cloudinary").v2;


exports.getUploadSignature = (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);

  try {
    const currentUtc = Math.round(new Date().getTime() / 1000);
    const drift = Math.abs(currentUtc - timestamp);

    if (drift > 300) { 
      console.warn(
        ` Server clock drift detected: ${drift} seconds difference from UTC. ` +
        `Cloudinary uploads may fail if drift exceeds allowed tolerance.`
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

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

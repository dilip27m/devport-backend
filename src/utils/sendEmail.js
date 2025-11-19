const { Resend } = require("resend");

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  const sender = process.env.EMAIL_FROM || "onboarding@resend.dev"; // Default to test email

  try {
    const { data, error } = await resend.emails.send({
      from: `DevPort <${sender}>`,
      to: [options.email], // Resend expects an array of recipients
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully via Resend:", data.id);
    return data;
  } catch (err) {
    console.error("Error sending email:", err);
    // Throw error so the controller knows it failed
    throw new Error("Email could not be sent. " + err.message);
  }
};

module.exports = sendEmail;
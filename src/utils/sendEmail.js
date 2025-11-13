const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create a transporter object using Gmail
  // We use the credentials from our .env file
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `DevPort <${process.env.GMAIL_USER}>`, // Sender address
    to: options.email, // List of receivers
    subject: options.subject, // Subject line
    html: options.html, // HTML body content
  };

  // 3. Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    // In a real app, you might want more robust error handling here
  }
};

module.exports = sendEmail;
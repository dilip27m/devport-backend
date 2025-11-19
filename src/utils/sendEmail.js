const brevo = require('@getbrevo/brevo');

const sendEmail = async (options) => {
  // 1. Configure the API client
  const apiInstance = new brevo.TransactionalEmailsApi();
  const apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  // 2. Define the email content
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = options.html;
  sendSmtpEmail.sender = { 
    name: "DevPort", 
    email: process.env.EMAIL_FROM // Must be the verified email in Brevo
  };
  sendSmtpEmail.to = [
    { email: options.email }
  ];

  try {
    // 3. Send the email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully via Brevo. Message ID:', data.messageId);
    return data;
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    // Throw error so the controller handles it correctly
    throw new Error(error.body?.message || "Email could not be sent");
  }
};

module.exports = sendEmail;
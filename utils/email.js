const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER,  // Email from environment variables
    pass: process.env.EMAIL_PASS,  // Email password or App password
  },
});

// Function to send email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Email from environment variables
    to: to, // Recipient's email
    subject: subject, // Subject of the email
    text: text, // Body of the email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmail;

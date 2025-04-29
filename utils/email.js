const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email provider (e.g., Gmail, SendGrid, etc.)
  auth: {
    user: '2klover1123@gmail.com',  // Replace with your email address
    pass: 'Kwc202743!',   // Replace with your email password or App Password
  }
});

// Send email
const mailOptions = {
  from: 'your-email@gmail.com',
  to: 'recipient-email@example.com',
  subject: 'Test Email',
  text: 'Hello, this is a test email sent using Nodemailer!',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error sending email:', error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
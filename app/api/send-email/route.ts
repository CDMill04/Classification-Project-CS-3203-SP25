import nodemailer from 'nodemailer';

// Function to send email notification to the user
export const sendEmailNotification = async (userEmail: string, status: string, fileName: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Sender's email from .env
      pass: process.env.EMAIL_PASS,  // Sender's email password (use App Password if using Gmail with 2FA)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email
    to: userEmail,                 // Recipient's email (the user’s email)
    subject: `Your file "${fileName}" has been ${status}`,
    text: `Hello, your file "${fileName}" has been ${status} by the admin.`,  // Email body
  };

  try {
    await transporter.sendMail(mailOptions);  // Send email
    console.log(`Notification sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


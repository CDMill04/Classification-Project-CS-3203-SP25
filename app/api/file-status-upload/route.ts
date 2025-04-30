import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email function to send notification
const sendEmailNotification = async (userEmail: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

// File status update API
export async function POST(request: Request) {
  try {
    const { userEmail, fileName, newStatus } = await request.json();  // Extract data from the request

    // Update file status in the database (implement this logic based on your database)
    // Example: await updateFileStatusInDatabase(fileName, newStatus);
    console.log(`Updating file status for ${fileName} to ${newStatus}`);

    // Construct email subject and body
    const subject = `Your file "${fileName}" has been ${newStatus}`;
    const text = `Hello, your file "${fileName}" has been ${newStatus} by the admin.`;

    // Send email notification to the user
    await sendEmailNotification(userEmail, subject, text);

    // Return a successful response
    return NextResponse.json({ message: "File status updated and email sent." });
  } catch (error: unknown) {
    // Handle errors safely
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
    }
  }
}

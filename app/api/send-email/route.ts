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
    const { userEmail, subject, text } = await request.json();

    // Call the function to send email
    await sendEmailNotification(userEmail, subject, text);

    // Return a successful response
    return NextResponse.json({ message: "Email sent successfully." });
  } catch (error: unknown) {
    // Type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred." }, { status: 500 });
    }
  }
}

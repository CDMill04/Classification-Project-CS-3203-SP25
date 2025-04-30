import { NextResponse } from "next/server";
import { sendEmailNotification } from "../send-email/route";  // Import send email function

export async function POST(request: Request) {
  const { userEmail, fileName, newStatus } = await request.json();

  try {
    // Update file status in the database (pseudo-code)
    // await updateFileStatusInDatabase(fileName, newStatus);

    // Send email notification to the user
    await sendEmailNotification(userEmail, newStatus, fileName);

    return NextResponse.json({ message: "File status updated and email sent." });
  } catch (error) {
    // Type assertion: cast `error` to an `Error` object
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

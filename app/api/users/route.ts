import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/data/users.json'); // Set file path

// GET acquires all users from users.json
export async function GET() {
  const file = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(file);

  return NextResponse.json(users);
}

// POST will create new users and store them in that file
export async function POST(req: Request) {
  const { name, email, password, role, school } = await req.json();

  // Validate that the user has entered the necessary fields
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  // Script injection prevention. This is in the frontend, but having it in both places makes it all the more secure
  const hasScript = /<script.*?>.*?<\/script>/gi;
  if (hasScript.test(name) || hasScript.test(email)) {
    return NextResponse.json({ error: "Input contains restricted content" }, { status: 400 });
  }

  // Length checks ensure that we some basic security
  if (name.length > 100) {
    return NextResponse.json({ error: "Name is too long" }, { status: 400 });
  }
  if (password.length < 6 || password.length > 100) {
    return NextResponse.json({ error: "Password must be between 6 and 100 characters." }, { status: 400 });
  }

  // Set defaults for role and school if missing. I have these implemented in the signhups, so these arent needed
  // They are just extra
  const userRole = role || "None";
  const userSchool = school || "None";

  // Continue normal user creation and field creation.
  const file = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(file);

  const existingUser = users.find((user: any) => user.email === email);
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: userRole,
    school: userSchool,
  };

  users.push(newUser);
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));

  return NextResponse.json(newUser, { status: 201 });
}

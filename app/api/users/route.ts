import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/data/users.json'); // Set file path

// GET used to acquire all users from users.json
// Now updated for MongoDB
export async function GET(req: Request) {
  const client = await clientPromise;
  const db = client.db('classification');
  const url = new URL(req.url);
  const email = url.searchParams.get('email');

  if (email) {
    const user = await db.collection('users').findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  }

  const users = await db.collection('users').find().toArray();
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

  // User creation, now updated for MongoDB

  const client = await clientPromise;
  const db = client.db('classification');
  const usersCollection = db.collection('users');

  const existingUser = await usersCollection.findOne({ email }); // Make sure the user is not an existing one upon signup

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const newUser = {
    name,
    email,
    password,
    role: role || "None",
    school: school || "None",
    createdAt: new Date(),
  };

  await usersCollection.insertOne(newUser);

  return NextResponse.json(newUser, { status: 201 });
}

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/data/users.json'); // Set file path

// GET aquires all users from users.json
export async function GET() {
  const file = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(file);

  return NextResponse.json(users);
}

// POST wil create new users and store them in that file
export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  const file = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(file);

  const existingUser = users.find((user: any) => user.email === email);
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const newUser = { id: Date.now(), name, email, password, role, };
  users.push(newUser);

  await fs.writeFile(filePath, JSON.stringify(users, null, 2));

  return NextResponse.json(newUser, { status: 201 });
}

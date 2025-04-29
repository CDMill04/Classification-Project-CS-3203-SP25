"use server";

import fs from "fs/promises";
import path from "path";

const DATA_FOLDER = path.join(process.cwd(), "app", "data");
const USER_FILE = path.join(process.cwd(), "app", "data", "users.json");
const METADATA_FOLDER = path.join(process.cwd(), "app", "data", "user-upload-data");

export async function fetchAllUsers() {
  try {
    const data = await fs.readFile(USER_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users.json:", error);
    return [];
  }
}

export async function fetchUserByEmail(email: string) {
  try {
    const users = await fetchAllUsers();
    return users.find((u: any) => u.email === email) || null;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
}

// NEW: Fetch uploads for a user by email
export async function fetchUserUploadsByEmail(email: string) {
    try {
      const uploadsPath = path.join(METADATA_FOLDER, `${email}.json`);
      const data = await fs.readFile(uploadsPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return []; // No uploads yet
      }
      console.error("Error reading uploads:", error);
      return [];
    }
  }


async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error("Error ensuring directory exists:", error);
  }
}

const usersPath = path.join(DATA_FOLDER, "users.json");
const schoolsPath = path.join(DATA_FOLDER, "schools.json");

// Read JSON helper function
async function readJSON(filePath: string) {
  await ensureDir(DATA_FOLDER);
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

// Write JSON helper function
async function writeJSON(filePath: string, data: any) {
  await ensureDir(DATA_FOLDER);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// USERS
export async function getAllUsers() {
  return await readJSON(usersPath);
}

export async function updateUser(email: string, updates: { role?: string; school?: string }) {
  const users = await getAllUsers();
  const idx = users.findIndex((u: any) => u.email === email);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updates };
  } else {
    users.push({ email, ...updates });
  }
  await writeJSON(usersPath, users);
}

// SCHOOLS
export async function getAllSchools() {
  return await readJSON(schoolsPath);
}

export async function createSchool(schoolName: string, adminEmail: string) {
  const schools = await getAllSchools();
  if (!schools.find((s: any) => s.name === schoolName)) {
    schools.push({ name: schoolName, admins: [adminEmail], teachers: [] });
    await writeJSON(schoolsPath, schools);
  }
}

export async function joinSchool(schoolName: string, teacherEmail: string) {
  const schools = await getAllSchools();
  const school = schools.find((s: any) => s.name === schoolName);
  if (school) {
    if (!school.teachers.includes(teacherEmail)) {
      school.teachers.push(teacherEmail);
      await writeJSON(schoolsPath, schools);
    }
  }
}

export async function promoteToAdmin(schoolName: string, email: string) {
  const schools = await getAllSchools();
  const school = schools.find((s: any) => s.name === schoolName);
  if (school) {
    if (!school.admins.includes(email)) {
      school.admins.push(email);
      await writeJSON(schoolsPath, schools);
    }
  }
}

// File uploads and lesson plans
export async function fetchUserUploads(userEmail: string) {
  try {
    const metadataPath = path.join(METADATA_FOLDER, `${userEmail}.json`);
    await ensureDir(METADATA_FOLDER);

    try {
      const data = await fs.readFile(metadataPath, "utf8");
      return JSON.parse(data);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        return []; // No file yet = no uploads
      }
      throw err;
    }
  } catch (error) {
    console.error("Error fetching uploads:", error);
    return [];
  }
}

export async function getLessonPlansForSchool(schoolName: string) {
  const schools = await getAllSchools();
  const school = schools.find((s: any) => s.name === schoolName);
  if (school) {
    const lessonPlans = [];
    for (const teacherEmail of [...school.admins, ...school.teachers]) {
      const uploads = await fetchUserUploads(teacherEmail);
      lessonPlans.push(...uploads);
    }
    return lessonPlans;
  }
  return [];
}

"use server";

import fs from "fs/promises";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "app", "data", "users.json");
const UPLOADS_FOLDER = path.join(process.cwd(), "app", "data", "user-upload-data");

export async function fetchAllUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
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
      const uploadsPath = path.join(UPLOADS_FOLDER, `${email}.json`);
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
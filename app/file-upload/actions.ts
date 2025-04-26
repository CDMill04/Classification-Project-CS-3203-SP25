/*
"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function uploadToBlob(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      throw new Error("No file provided")
    }

    // Generate a unique filename to avoid collisions
    const uniqueFilename = `${Date.now()}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    // Revalidate the file-upload page to show the new upload
    revalidatePath("/file-upload")

    return {
      success: true,
      url: blob.url,
      filename: file.name,
    }
  } catch (error) {
    console.error("Error uploading to blob:", error)
    return {
      success: false,
      error: "Failed to upload file. " + (error instanceof Error ? error.message : "Unknown error"),
    }
  }
}

export async function fetchUserUploads(USER_EMAIL: string) {
  try {
    const response = await fetch(`https://vercel.blob/${USER_EMAIL}.json`) // Replace with actual blob URL
    if (!response.ok) {
      // If the file doesn't exist, return an empty array
      return []
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching user uploads:", error)
    return []
  }
}

export async function updateUserUploads(USER_EMAIL: string, newUpload: object) {
  try {
    const existingUploads = await fetchUserUploads(USER_EMAIL)
    const updatedUploads = [...existingUploads, newUpload]

    // Upload the updated JSON file to the blob storage
    const blob = await put(`${USER_EMAIL}.json`, JSON.stringify(updatedUploads), {
      access: "public",
    })

    return blob.url
  } catch (error) {
    console.error("Error updating user uploads:", error)
    throw error
  }
}
*/

"use server"

import fs from "fs/promises"
import path from "path"

// Define a local directory to store JSON files
const LOCAL_STORAGE_DIR = path.join(process.cwd(), "public", "local-uploads")

const USER_EMAIL = "userEmail@example.com"

// Ensure the directory exists
async function ensureLocalStorageDir() {
  try {
    await fs.mkdir(LOCAL_STORAGE_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating local storage directory:", error)
  }
}

// Simulate uploading a file to local storage
export async function uploadToBlob(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      throw new Error("No file provided")
    }

    // Use the original filename
    const filePath = path.join(LOCAL_STORAGE_DIR, file.name);

    // Write the file to the local storage directory
    await ensureLocalStorageDir()
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()))

    console.log("File saved at:", filePath) // Debugging

    return {
      success: true,
      url: `http://192.168.1.247:3000/local-uploads/${file.name}`, // Simulate a URL
      filename: file.name,
    }
  } catch (error) {
    console.error("Error uploading to local storage:", error)
    return {
      success: false,
      error: "Failed to upload file. " + (error instanceof Error ? error.message : "Unknown error"),
    }
  }
}

// Fetch user uploads from a local JSON file
export async function fetchUserUploads(USER_EMAIL: string) {
  try {
    const filePath = path.join(LOCAL_STORAGE_DIR, `${USER_EMAIL}.json`)
    console.log("Looking for file at:", filePath) // Debugging

    // Check if the file exists
    try {
      const data = await fs.readFile(filePath, "utf-8")
      console.log("Fetched uploads:", JSON.parse(data)) // Debugging
      return JSON.parse(data)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        // File doesn't exist, return an empty array
        console.log("No uploads found, returning empty array") // Debugging
        return []
      }
      throw error
    }
  } catch (error) {
    console.error("Error fetching user uploads:", error)
    return []
  }
}

// Update user uploads in a local JSON file
export async function updateUserUploads(USER_EMAIL: string, newUpload: object) {
  try {
    const existingUploads = await fetchUserUploads(USER_EMAIL)
    const updatedUploads = [...existingUploads, newUpload]
    const filePath = path.join(LOCAL_STORAGE_DIR, `${USER_EMAIL}.json`)

    // Write the updated JSON file to the local storage directory
    await ensureLocalStorageDir()
    await fs.writeFile(filePath, JSON.stringify(updatedUploads, null, 2))

    return `http://192.168.1.247:3000/local-uploads/${USER_EMAIL}.json` // Simulate a URL
  } catch (error) {
    console.error("Error updating user uploads:", error)
    throw error
  }
}

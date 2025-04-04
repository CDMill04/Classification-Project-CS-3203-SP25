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


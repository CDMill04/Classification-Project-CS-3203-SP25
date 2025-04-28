/*
"use server";

import { put } from "@vercel/blob";

// Simulate uploading a file to Vercel Blob
export async function uploadToBlob(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    // Use the original filename
    const filename = file.name;

    // Upload the file to Vercel Blob
    const blob = await put(filename, file, {
      access: "public", // Make the file publicly accessible
      allowOverwrite: true, // Allow overwriting the existing file
      cacheControlMaxAge: 60, // Set cache control max age to 60 seconds
    });

    console.log("File uploaded to Vercel Blob:", blob.url); // Debugging

    return {
      success: true,
      url: blob.url, // Return the public URL of the uploaded file
      filename: filename, // Return the filename
    };
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    return {
      success: false,
      error: "Failed to upload file. " + (error instanceof Error ? error.message : "Unknown error"),
    };
  }
}

// Fetch user uploads from a JSON file stored in Vercel Blob
export async function fetchUserUploads(USER_EMAIL: string) {
  try {
    const randomQuery = Math.random().toString(36).substring(2, 15); // Generate a random query string
    const blobUrl = `https://r3agn7hsgw8mrqmz.public.blob.vercel-storage.com/${USER_EMAIL}.json?v=${randomQuery}`; // Replace with your actual Vercel Blob base URL
    console.log("Blob URL:", blobUrl); // Debugging

    // Fetch the JSON file from Vercel Blob
    const response = await fetch(blobUrl, { 
      cache: "no-store", 
      headers: {
        "Cache-Control": "no-cache", // Disable caching
      }
    });
    console.log("Fetching uploads from Vercel Blob:", response); // Debugging

    if (!response.ok) {
      // If the file doesn't exist, return an empty array
      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);
      console.log("No uploads found, returning empty array"); // Debugging
      return [];
    }

    const uploads = await response.json();
    console.log("Fetched uploads from Vercel Blob:", uploads); // Debugging
    return uploads;
  } catch (error) {
    console.error("Error fetching user uploads from Vercel Blob:", error);
    return [];
  }
}

// Update user uploads in a JSON file stored in Vercel Blob
export async function updateUserUploads(USER_EMAIL: string, newUpload: object) {
  try {
    // Fetch the existing uploads
    const existingUploads = await fetchUserUploads(USER_EMAIL);
    const updatedUploads = [...existingUploads, newUpload];

    // Upload the updated JSON file to Vercel Blob
    const blob = await put(`${USER_EMAIL}.json`, JSON.stringify(updatedUploads), {
      access: "public", // Make the JSON file publicly accessible
      allowOverwrite: true, // Allow overwriting the existing file
      cacheControlMaxAge: 60, // Set cache control max age to 60 seconds
    });

    console.log("Updated uploads saved to Vercel Blob:", blob.url); // Debugging
    return blob.url; // Return the public URL of the updated JSON file
  } catch (error) {
    console.error("Error updating user uploads in Vercel Blob:", error);
    throw error;
  }
}

// Update the status of a specific upload in the JSON file stored in Vercel Blob
export async function updateUploadStatus(USER_EMAIL: string, filename: string, newStatus: string) {
  try {
    // Fetch the existing uploads
    const existingUploads = await fetchUserUploads(USER_EMAIL);

    // Find and update the specific file's status
    const updatedUploads = existingUploads.map((upload: any) =>
      upload.filename === filename ? { ...upload, status: newStatus } : upload
    );

    console.log("Updated uploads array:", updatedUploads); // Debugging

    // Upload the updated JSON file to Vercel Blob
    const blob = await put(`${USER_EMAIL}.json`, JSON.stringify(updatedUploads), {
      access: "public", // Make the JSON file publicly accessible
      allowOverwrite: true, // Allow overwriting the existing file
      cacheControlMaxAge: 60, // Set cache control max age to 60 seconds
    });

    console.log("Updated status saved to Vercel Blob:", blob.url); // Debugging
    return blob.url; // Return the public URL of the updated JSON file
  } catch (error) {
    console.error("Error updating upload status in Vercel Blob:", error);
    throw error;
  }
}

*/

"use server";

import fs from "fs/promises";
import path from "path";

// Path to uploaded files (actual uploaded documents)
const UPLOADS_FOLDER = path.join(process.cwd(), "public", "local-uploads", "uploaded-files");

// Path to metadata JSON files
const METADATA_FOLDER = path.join(process.cwd(), "app", "data", "user-upload-data");

async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error("Error ensuring directory exists:", error);
  }
}

// Upload file to local filesystem
export async function uploadToBlob(formData: FormData, userEmail: string) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const filePath = path.join(UPLOADS_FOLDER, file.name);
    await ensureDir(UPLOADS_FOLDER);
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    const fileUrl = `/local-uploads/uploaded-files/${file.name}`; // public path

    return {
      success: true,
      url: fileUrl,
      filename: file.name,
    };
  } catch (error) {
    console.error("Error uploading:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Fetch user uploads (metadata JSON)
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

// Save (or update) a user's uploads
export async function updateUserUploads(userEmail: string, newUpload: object) {
  try {
    const uploads = await fetchUserUploads(userEmail);
    const updatedUploads = [...uploads, newUpload];

    const metadataPath = path.join(METADATA_FOLDER, `${userEmail}.json`);
    await ensureDir(METADATA_FOLDER);
    await fs.writeFile(metadataPath, JSON.stringify(updatedUploads, null, 2));

    return `/local-uploads/files/${userEmail}.json`;
  } catch (error) {
    console.error("Error updating uploads:", error);
    throw error;
  }
}

export async function updateFileStatus(userEmail: string, filename: string, newStatus: string) {
  try {
    const metadataPath = path.join(METADATA_FOLDER, `${userEmail}.json`);
    await ensureDir(METADATA_FOLDER);

    const data = await fs.readFile(metadataPath, "utf8");
    let uploads = JSON.parse(data);

    // Find the file and update status
    uploads = uploads.map((upload: any) => {
      if (upload.filename === filename) {
        return { ...upload, status: newStatus };
      }
      return upload;
    });

    // Save the updated uploads back
    await fs.writeFile(metadataPath, JSON.stringify(uploads, null, 2));

    return { success: true };
  } catch (error) {
    console.error("Error updating file status:", error);
    throw error;
  }
}


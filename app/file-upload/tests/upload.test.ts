// __tests__/uploadToBlob.test.ts

import { uploadToBlob, fetchUserUploads, updateUserUploads, updateFileStatus } from "../actions";
import { FormData, File } from "formdata-node";
import fs from "fs/promises";
import path from "path";

// Constants for testing
const TEST_FILE_CONTENT = "Hello, this is a test file!";
const TEST_FILE_NAME = "testfile.txt";
const USER_EMAIL = "testuser@example.com";

// Setup paths
const UPLOADS_FOLDER = path.join(process.cwd(), "public", "local-uploads", "uploaded-files");
const METADATA_FOLDER = path.join(process.cwd(), "app", "data", "user-upload-data");
const TEST_FILE_PATH = path.join(UPLOADS_FOLDER, TEST_FILE_NAME);
const TEST_METADATA_PATH = path.join(METADATA_FOLDER, `${USER_EMAIL}.json`);

describe("File Upload Actions", () => {
  beforeAll(async () => {
    // Ensure necessary directories exist
    await fs.mkdir(UPLOADS_FOLDER, { recursive: true });
    await fs.mkdir(METADATA_FOLDER, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test file and metadata after each test
    try {
      await fs.unlink(TEST_FILE_PATH);
    } catch (err) {
      // Ignore if file does not exist
    }
    try {
      await fs.unlink(TEST_METADATA_PATH);
    } catch (err) {
      // Ignore if file does not exist
    }
  });

  it("uploads a file successfully", async () => {
    // Create a mock FormData with a file
    const formData = new FormData();
    const mockFile = new File([Buffer.from(TEST_FILE_CONTENT)], TEST_FILE_NAME, { type: "text/plain" });
    formData.set("file", mockFile);

    // Upload the file
    // Convert formdata-node FormData to native FormData
    const nativeFormData = new globalThis.FormData();
    for (const [key, value] of formData) {
      if (value instanceof File) {
        nativeFormData.append(key, new Blob([await value.arrayBuffer()], { type: value.type }), value.name);
      }
    }

    const result = await uploadToBlob(nativeFormData, USER_EMAIL);

    expect(result.success).toBe(true);
    expect(result.filename).toBe(TEST_FILE_NAME);

    // Verify that file was written to disk
    const fileExists = await fs.access(TEST_FILE_PATH).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);

    // Verify that file content matches
    const fileContent = await fs.readFile(TEST_FILE_PATH, "utf8");
    expect(fileContent).toBe(TEST_FILE_CONTENT);
  });

  it("returns an error if no file provided", async () => {
    const formData = new FormData(); // No file

    // Convert formdata-node FormData to native FormData
    const nativeFormData = new globalThis.FormData();
    for (const [key, value] of formData) {
      if (value instanceof File) {
        nativeFormData.append(key, new Blob([await value.arrayBuffer()], { type: value.type }), value.name);
      }
    }

    const result = await uploadToBlob(nativeFormData, USER_EMAIL);

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/No file provided/);
  });

  it("fetches user uploads, returns empty array if no file exists", async () => {
    const uploads = await fetchUserUploads(USER_EMAIL);
    expect(Array.isArray(uploads)).toBe(true);
    expect(uploads.length).toBe(0);
  });

  it("updates user uploads successfully", async () => {
    const newUpload = {
      date: "2025-04-28",
      filename: TEST_FILE_NAME,
      semester: "Fall",
      status: "Pending",
      url: `/local-uploads/uploaded-files/${TEST_FILE_NAME}`,
    };

    // Update uploads
    const uploadUrl = await updateUserUploads(USER_EMAIL, newUpload);

    expect(uploadUrl).toContain(`/local-uploads/files/${USER_EMAIL}.json`);

    // Verify that metadata file was created
    const metadataContent = await fs.readFile(TEST_METADATA_PATH, "utf8");
    const metadata = JSON.parse(metadataContent);

    expect(Array.isArray(metadata)).toBe(true);
    expect(metadata.length).toBe(1);
    expect(metadata[0]).toMatchObject(newUpload);
  });

  it("updates file status successfully", async () => {
    // First, manually create a metadata file
    const initialUpload = [{
      date: "2025-04-28",
      filename: TEST_FILE_NAME,
      semester: "Fall",
      status: "Pending",
      url: `/local-uploads/uploaded-files/${TEST_FILE_NAME}`,
    }];
    await fs.writeFile(TEST_METADATA_PATH, JSON.stringify(initialUpload, null, 2));

    // Update the status
    const result = await updateFileStatus(USER_EMAIL, TEST_FILE_NAME, "Approved");

    expect(result.success).toBe(true);

    // Verify the status was updated
    const updatedMetadataContent = await fs.readFile(TEST_METADATA_PATH, "utf8");
    const updatedMetadata = JSON.parse(updatedMetadataContent);

    expect(updatedMetadata[0].status).toBe("Approved");
  });
});

import { uploadToBlob } from "../actions";
import { FormData } from "formdata-node";
import fs from "fs/promises";
import path from "path";

const TEST_FILE_CONTENT = "Hello, this is a test file!";
const TEST_FILE_NAME = "testfile.txt";
const USER_EMAIL = "testuser@example.com";

// Setup paths
const UPLOADS_FOLDER = path.join(process.cwd(), "public", "local-uploads", "uploaded-files");
const TEST_FILE_PATH = path.join(UPLOADS_FOLDER, TEST_FILE_NAME);

describe("uploadToBlob", () => {
  beforeAll(async () => {
    // Ensure the uploads folder exists
    await fs.mkdir(UPLOADS_FOLDER, { recursive: true });
  });

  afterEach(async () => {
    // Clean up the uploaded test file after each test
    try {
      await fs.unlink(TEST_FILE_PATH);
    } catch (err) {
      // Ignore if file does not exist
    }
  });

  it("uploads a file successfully", async () => {
    // Create a mock FormData object
    const formData = new FormData();
    const file = new File([TEST_FILE_CONTENT], TEST_FILE_NAME, { type: "text/plain" });
    formData.set("file", file);

    const result = await uploadToBlob(formData as unknown as globalThis.FormData, USER_EMAIL);

    expect(result.success).toBe(true);
    expect(result.filename).toBe(TEST_FILE_NAME);
    expect(result.url).toContain(`/local-uploads/uploaded-files/${TEST_FILE_NAME}`);

    // Check that the file actually exists now
    const uploadedFileContent = await fs.readFile(TEST_FILE_PATH, "utf8");
    expect(uploadedFileContent).toBe(TEST_FILE_CONTENT);
  });

  it("returns error if no file is provided", async () => {
    const formData = new FormData(); // No file

    const result = await uploadToBlob(formData as unknown as globalThis.FormData, USER_EMAIL);

    expect(result.success).toBe(false);
    expect(result.error).toBe("No file provided");
  });
});

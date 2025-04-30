import fs from "fs/promises";
import path from "path";
import { fetchUserUploadsByEmail } from "@/app/dashboard/actions";

jest.mock("fs/promises");

describe("fetchUserUploadsByEmail", () => {
  const mockEmail = "testuser@example.com";
  const mockUploads = [
    { filename: "test1.pdf", date: "2024-04-01", status: "Approved", url: "/uploads/test1.pdf" },
    { filename: "test2.pdf", date: "2024-04-02", status: "Pending", url: "/uploads/test2.pdf" },
  ];

  it("should return parsed uploads if file exists", async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockUploads));

    const result = await fetchUserUploadsByEmail(mockEmail);

    expect(fs.readFile).toHaveBeenCalled();
    expect(result).toEqual(mockUploads);
  });

  it("should return empty array if file not found (ENOENT)", async () => {
    const err = new Error("File not found") as NodeJS.ErrnoException;
    err.code = "ENOENT";

    (fs.readFile as jest.Mock).mockRejectedValue(err);

    const result = await fetchUserUploadsByEmail(mockEmail);

    expect(result).toEqual([]);
  });

  it("should return empty array and log error for other read failures", async () => {
    const err = new Error("Permission denied") as NodeJS.ErrnoException;
    err.code = "EACCES";

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (fs.readFile as jest.Mock).mockRejectedValue(err);

    const result = await fetchUserUploadsByEmail(mockEmail);

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith("Error reading uploads:", err);

    consoleSpy.mockRestore();
  });
});
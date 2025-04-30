import fs from "fs/promises";
import path from "path";
import {
  getLessonPlansForSchool
} from "../actions";

jest.mock("fs/promises");

const mockedFs = fs as jest.Mocked<typeof fs>;

const SCHOOLS_FILE = path.join(process.cwd(), "app", "data", "schools.json");
const USER_UPLOADS_PATH = (email: string) =>
  path.join(process.cwd(), "app", "data", "user-upload-data", `${email}.json`);

describe("getLessonPlansForSchool", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns lesson plans for valid school 'OU'", async () => {
    // Mock school data with admins and teachers
    mockedFs.readFile.mockImplementation(async (filePath: any) => {
      if (filePath === SCHOOLS_FILE) {
        return JSON.stringify([
          {
            name: "OU",
            admins: ["admin@ou.edu"],
            teachers: ["teacher1@ou.edu"]
          }
        ]);
      }

      if (filePath === USER_UPLOADS_PATH("admin@ou.edu")) {
        return JSON.stringify([
          { title: "Admin Plan 1" },
          { title: "Admin Plan 2" }
        ]);
      }

      if (filePath === USER_UPLOADS_PATH("teacher1@ou.edu")) {
        return JSON.stringify([
          { title: "Teacher Plan 1" }
        ]);
      }

      throw { code: "ENOENT" }; // for other unknown files
    });

    const result = await getLessonPlansForSchool("OU");

    expect(result).toEqual([
      { title: "Admin Plan 1", email: "admin@ou.edu" },
      { title: "Admin Plan 2", email: "admin@ou.edu" },
      { title: "Teacher Plan 1", email: "teacher1@ou.edu" }
    ]);
  });

  it("returns empty array for non-existent school 'UT'", async () => {
    mockedFs.readFile.mockImplementation(async (filePath: any) => {
      if (filePath === SCHOOLS_FILE) {
        return JSON.stringify([
          {
            name: "OU",
            admins: ["admin@ou.edu"],
            teachers: ["teacher1@ou.edu"]
          }
        ]);
      }
      throw { code: "ENOENT" };
    });

    const result = await getLessonPlansForSchool("UT");
    expect(result).toEqual([]);
  });
});

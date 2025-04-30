// app/signup/tests/userCreationTest.test.ts

describe("User creation", () => {
    it("should create a user object with correct fields", () => { //This unit test should pass.
      const user = { 
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "None",
      };
  
      expect(user).toHaveProperty("id"); // It expects new users to be created with an email, name, password, and role of None
      expect(user).toHaveProperty("name", "Test User");
      expect(user).toHaveProperty("email", "test@example.com");
      expect(user).toHaveProperty("password", "password123");
      expect(user).toHaveProperty("role", "None");
    });
  });
  
  describe("User creation (failure case)", () => {    // Meanwhile, this test should fail IF THE CODE IS WORKING CORRECTLY
    it("should fail if the default role is not 'Teacher'", () => {
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "None",
      };
  
      expect(user.role).toBe("Teacher"); // If the role assigned on creation is not Teacher, fail.
      // This should always fail as the role assigned on creation is "None", not "Teacher"
    });
  });
  
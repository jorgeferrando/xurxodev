import { describe, it, expect, beforeEach } from "vitest";
import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";
import { InMemoryStorage } from "../storage/InMemoryStorage";

describe("Create User Command (Integration)", () => {
  beforeEach(() => {
    // Limpiar storage antes de cada test
    InMemoryStorage.getInstance().clear();
  });

  describe("Creating user with valid data", () => {
    it("should create user with valid name, email and password", () => {
      const nameResult = Name.create("Jorge");
      const emailResult = Email.create("jorge@google.com");
      const passwordResult = Password.create("Password123");

      expect(nameResult.isSuccess()).toBe(true);
      expect(emailResult.isSuccess()).toBe(true);
      expect(passwordResult.isSuccess()).toBe(true);

      const userResult = User.create(
        emailResult.getValue(),
        nameResult.getValue(),
        passwordResult.getValue()
      );

      expect(userResult.isSuccess()).toBe(true);

      const user = userResult.getValue();
      expect(user.id).toBeDefined();
      expect(user.name.getValue()).toBe("Jorge");
      expect(user.email.getValue()).toBe("jorge@google.com");
      expect(user.password.getValue()).toBe("Password123");
    });

    it("should store user in storage", () => {
      const emailResult = Email.create("test@example.com");
      const nameResult = Name.create("Test User");
      const passwordResult = Password.create("Test1234");

      const userResult = User.create(
        emailResult.getValue(),
        nameResult.getValue(),
        passwordResult.getValue()
      );

      const user = userResult.getValue();
      const storage = InMemoryStorage.getInstance();
      storage.addUser(user);

      const users = storage.getAllUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe(user.id);
    });
  });

  describe("Validation errors", () => {
    it("should fail with invalid name", () => {
      const nameResult = Name.create("A"); // Muy corto

      expect(nameResult.isFailure()).toBe(true);
      expect(nameResult.getError()).toContain("al menos 2 caracteres");
    });

    it("should fail with invalid email", () => {
      const emailResult = Email.create("invalid-email");

      expect(emailResult.isFailure()).toBe(true);
      expect(emailResult.getError()).toContain("formato");
    });

    it("should fail with invalid password", () => {
      const passwordResult = Password.create("short");

      expect(passwordResult.isFailure()).toBe(true);
      expect(passwordResult.getError()).toContain("8 caracteres");
    });

    it("should fail with password without numbers", () => {
      const passwordResult = Password.create("OnlyLetters");

      expect(passwordResult.isFailure()).toBe(true);
      expect(passwordResult.getError()).toContain("número");
    });

    it("should fail with password without letters", () => {
      const passwordResult = Password.create("12345678");

      expect(passwordResult.isFailure()).toBe(true);
      expect(passwordResult.getError()).toContain("letra");
    });
  });

  describe("Complete flow", () => {
    it("should handle complete user creation flow", () => {
      const storage = InMemoryStorage.getInstance();

      // Crear primer usuario
      const user1Result = User.create(
        Email.create("user1@test.com").getValue(),
        Name.create("User One").getValue(),
        Password.create("Pass1234").getValue()
      );
      storage.addUser(user1Result.getValue());

      // Crear segundo usuario
      const user2Result = User.create(
        Email.create("user2@test.com").getValue(),
        Name.create("User Two").getValue(),
        Password.create("Pass5678").getValue()
      );
      storage.addUser(user2Result.getValue());

      // Verificar que ambos están en storage
      const users = storage.getAllUsers();
      expect(users).toHaveLength(2);
      expect(users[0].email.getValue()).toBe("user1@test.com");
      expect(users[1].email.getValue()).toBe("user2@test.com");
    });
  });
});

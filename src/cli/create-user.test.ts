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
      const name = Name.create("Jorge");
      const email = Email.create("jorge@google.com");
      const password = Password.create("Password123");

      const user = User.create(email, name, password);

      expect(user.id).toBeDefined();
      expect(user.name.getValue()).toBe("Jorge");
      expect(user.email.getValue()).toBe("jorge@google.com");
      expect(user.password.getValue()).toBe("Password123");
    });

    it("should store user in storage", () => {
      const email = Email.create("test@example.com");
      const name = Name.create("Test User");
      const password = Password.create("Test1234");

      const user = User.create(email, name, password);
      const storage = InMemoryStorage.getInstance();
      storage.addUser(user);

      const users = storage.getAllUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe(user.id);
    });
  });

  describe("Validation errors", () => {
    it("should fail with invalid name", () => {
      expect(() => Name.create("A")).toThrow("al menos 2 caracteres");
    });

    it("should fail with invalid email", () => {
      expect(() => Email.create("invalid-email")).toThrow("formato");
    });

    it("should fail with invalid password", () => {
      expect(() => Password.create("short")).toThrow("8 caracteres");
    });

    it("should fail with password without numbers", () => {
      expect(() => Password.create("OnlyLetters")).toThrow("número");
    });

    it("should fail with password without letters", () => {
      expect(() => Password.create("12345678")).toThrow("letra");
    });
  });

  describe("Complete flow", () => {
    it("should handle complete user creation flow", () => {
      const storage = InMemoryStorage.getInstance();

      // Crear primer usuario
      const user1 = User.create(
        Email.create("user1@test.com"),
        Name.create("User One"),
        Password.create("Pass1234")
      );
      storage.addUser(user1);

      // Crear segundo usuario
      const user2 = User.create(
        Email.create("user2@test.com"),
        Name.create("User Two"),
        Password.create("Pass5678")
      );
      storage.addUser(user2);

      // Verificar que ambos están en storage
      const users = storage.getAllUsers();
      expect(users).toHaveLength(2);
      expect(users[0].email.getValue()).toBe("user1@test.com");
      expect(users[1].email.getValue()).toBe("user2@test.com");
    });
  });
});

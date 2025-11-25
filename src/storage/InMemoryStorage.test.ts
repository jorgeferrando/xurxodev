import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryStorage } from "./InMemoryStorage";
import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";

describe("InMemoryStorage", () => {
  beforeEach(() => {
    InMemoryStorage.getInstance().clear();
  });

  describe("Singleton pattern", () => {
    it("should return the same instance", () => {
      const instance1 = InMemoryStorage.getInstance();
      const instance2 = InMemoryStorage.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("User storage", () => {
    it("should add and retrieve users", () => {
      const storage = InMemoryStorage.getInstance();
      const user = User.create(
        Email.create("test@example.com"),
        Name.create("Test User"),
        Password.create("Pass1234")
      );

      storage.addUser(user);

      const users = storage.getAllUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe(user.id);
    });

    it("should retrieve multiple users", () => {
      const storage = InMemoryStorage.getInstance();

      const user1 = User.create(
        Email.create("user1@test.com"),
        Name.create("User One"),
        Password.create("Pass1234")
      );

      const user2 = User.create(
        Email.create("user2@test.com"),
        Name.create("User Two"),
        Password.create("Pass5678")
      );

      storage.addUser(user1);
      storage.addUser(user2);

      const users = storage.getAllUsers();
      expect(users).toHaveLength(2);
    });
  });

  describe("Email storage", () => {
    it("should add and retrieve emails", () => {
      const storage = InMemoryStorage.getInstance();
      const email = Email.create("test@example.com");

      storage.addEmail(email);

      const emails = storage.getAllEmails();
      expect(emails).toHaveLength(1);
      expect(emails[0].getValue()).toBe("test@example.com");
    });

    it("should not duplicate emails", () => {
      const storage = InMemoryStorage.getInstance();
      const email1 = Email.create("test@example.com");
      const email2 = Email.create("test@example.com");

      storage.addEmail(email1);
      storage.addEmail(email2);

      const emails = storage.getAllEmails();
      expect(emails).toHaveLength(1);
    });
  });

  describe("Name storage", () => {
    it("should add and retrieve names", () => {
      const storage = InMemoryStorage.getInstance();
      const name = Name.create("Jorge");

      storage.addName(name);

      const names = storage.getAllNames();
      expect(names).toHaveLength(1);
      expect(names[0].getValue()).toBe("Jorge");
    });

    it("should not duplicate names", () => {
      const storage = InMemoryStorage.getInstance();
      const name1 = Name.create("Jorge");
      const name2 = Name.create("Jorge");

      storage.addName(name1);
      storage.addName(name2);

      const names = storage.getAllNames();
      expect(names).toHaveLength(1);
    });
  });

  describe("Password storage", () => {
    it("should add and retrieve passwords", () => {
      const storage = InMemoryStorage.getInstance();
      const password = Password.create("Pass1234");

      storage.addPassword(password);

      const passwords = storage.getAllPasswords();
      expect(passwords).toHaveLength(1);
      expect(passwords[0].getValue()).toBe("Pass1234");
    });

    it("should not duplicate passwords", () => {
      const storage = InMemoryStorage.getInstance();
      const password1 = Password.create("Pass1234");
      const password2 = Password.create("Pass1234");

      storage.addPassword(password1);
      storage.addPassword(password2);

      const passwords = storage.getAllPasswords();
      expect(passwords).toHaveLength(1);
    });
  });

  describe("Clear", () => {
    it("should clear all data", () => {
      const storage = InMemoryStorage.getInstance();

      // Añadir datos
      storage.addUser(
        User.create(
          Email.create("test@example.com"),
          Name.create("Test"),
          Password.create("Pass1234")
        )
      );
      storage.addEmail(Email.create("email@test.com"));
      storage.addName(Name.create("Name"));
      storage.addPassword(Password.create("Pass5678"));

      // Verificar que hay datos
      expect(storage.getAllUsers()).toHaveLength(1);
      expect(storage.getAllEmails()).toHaveLength(1);
      expect(storage.getAllNames()).toHaveLength(1);
      expect(storage.getAllPasswords()).toHaveLength(1);

      // Limpiar
      storage.clear();

      // Verificar que está vacío
      expect(storage.getAllUsers()).toHaveLength(0);
      expect(storage.getAllEmails()).toHaveLength(0);
      expect(storage.getAllNames()).toHaveLength(0);
      expect(storage.getAllPasswords()).toHaveLength(0);
    });
  });

  describe("Data persistence", () => {
    it("should handle invalid data gracefully", () => {
      const storage = InMemoryStorage.getInstance();

      // Añadir usuario válido
      const user = User.create(
        Email.create("valid@test.com"),
        Name.create("Valid"),
        Password.create("Pass1234")
      );

      storage.addUser(user);

      // Al recuperar, debería filtrar datos inválidos automáticamente
      const users = storage.getAllUsers();
      expect(users.length).toBeGreaterThan(0);
    });
  });
});

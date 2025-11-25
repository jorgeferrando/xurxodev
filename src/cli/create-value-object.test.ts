import { describe, it, expect, beforeEach } from "vitest";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";
import { InMemoryStorage } from "../storage/InMemoryStorage";

describe("Create Value Object Command (Integration)", () => {
  beforeEach(() => {
    InMemoryStorage.getInstance().clear();
  });

  describe("Email creation", () => {
    it("should create and store valid email", () => {
      const email = Email.create("maria@example.com");
      const storage = InMemoryStorage.getInstance();
      storage.addEmail(email);

      const emails = storage.getAllEmails();
      expect(emails).toHaveLength(1);
      expect(emails[0].getValue()).toBe("maria@example.com");
      expect(emails[0].domain).toBe("example.com");
    });

    it("should fail with invalid email format", () => {
      expect(() => Email.create("invalid")).toThrow("formato");
    });

    it("should normalize email to lowercase", () => {
      const email = Email.create("USER@EXAMPLE.COM");
      expect(email.getValue()).toBe("user@example.com");
    });

    it("should not duplicate emails in storage", () => {
      const storage = InMemoryStorage.getInstance();
      const email1 = Email.create("test@example.com");
      const email2 = Email.create("test@example.com");

      storage.addEmail(email1);
      storage.addEmail(email2);

      const emails = storage.getAllEmails();
      expect(emails).toHaveLength(1);
    });
  });

  describe("Name creation", () => {
    it("should create and store valid name", () => {
      const name = Name.create("Pedro");
      const storage = InMemoryStorage.getInstance();
      storage.addName(name);

      const names = storage.getAllNames();
      expect(names).toHaveLength(1);
      expect(names[0].getValue()).toBe("Pedro");
    });

    it("should fail with name too short", () => {
      expect(() => Name.create("A")).toThrow("al menos 2 caracteres");
    });

    it("should fail with name containing numbers", () => {
      expect(() => Name.create("Pedro123")).toThrow("solo puede contener letras");
    });

    it("should accept names with accents", () => {
      const name = Name.create("José María");
      const storage = InMemoryStorage.getInstance();
      storage.addName(name);

      const names = storage.getAllNames();
      expect(names[0].getValue()).toBe("José María");
    });

    it("should trim whitespace", () => {
      const name = Name.create("  Pedro  ");
      expect(name.getValue()).toBe("Pedro");
    });
  });

  describe("Password creation", () => {
    it("should create and store valid password", () => {
      const password = Password.create("Pass1234");
      const storage = InMemoryStorage.getInstance();
      storage.addPassword(password);

      const passwords = storage.getAllPasswords();
      expect(passwords).toHaveLength(1);
      expect(passwords[0].getValue()).toBe("Pass1234");
      expect(passwords[0].toString()).toBe("********");
    });

    it("should fail with password too short", () => {
      expect(() => Password.create("Pass1")).toThrow("8 caracteres");
    });

    it("should fail without letter", () => {
      expect(() => Password.create("12345678")).toThrow("letra");
    });

    it("should fail without number", () => {
      expect(() => Password.create("PasswordOnly")).toThrow("número");
    });
  });

  describe("Multiple value objects", () => {
    it("should store multiple different value objects", () => {
      const storage = InMemoryStorage.getInstance();

      const email = Email.create("test@example.com");
      const name = Name.create("Test User");
      const password = Password.create("Test1234");

      storage.addEmail(email);
      storage.addName(name);
      storage.addPassword(password);

      expect(storage.getAllEmails()).toHaveLength(1);
      expect(storage.getAllNames()).toHaveLength(1);
      expect(storage.getAllPasswords()).toHaveLength(1);
    });
  });
});

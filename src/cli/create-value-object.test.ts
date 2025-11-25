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
      const emailResult = Email.create("maria@example.com");

      expect(emailResult.isSuccess()).toBe(true);

      const email = emailResult.getValue();
      const storage = InMemoryStorage.getInstance();
      storage.addEmail(email);

      const emails = storage.getAllEmails();
      expect(emails).toHaveLength(1);
      expect(emails[0].getValue()).toBe("maria@example.com");
      expect(emails[0].domain).toBe("example.com");
    });

    it("should fail with invalid email format", () => {
      const emailResult = Email.create("invalid");

      expect(emailResult.isFailure()).toBe(true);
      expect(emailResult.getError()).toContain("formato");
    });

    it("should normalize email to lowercase", () => {
      const emailResult = Email.create("USER@EXAMPLE.COM");

      expect(emailResult.isSuccess()).toBe(true);
      expect(emailResult.getValue().getValue()).toBe("user@example.com");
    });

    it("should not duplicate emails in storage", () => {
      const storage = InMemoryStorage.getInstance();
      const email1 = Email.create("test@example.com").getValue();
      const email2 = Email.create("test@example.com").getValue();

      storage.addEmail(email1);
      storage.addEmail(email2);

      const emails = storage.getAllEmails();
      expect(emails).toHaveLength(1);
    });
  });

  describe("Name creation", () => {
    it("should create and store valid name", () => {
      const nameResult = Name.create("Pedro");

      expect(nameResult.isSuccess()).toBe(true);

      const name = nameResult.getValue();
      const storage = InMemoryStorage.getInstance();
      storage.addName(name);

      const names = storage.getAllNames();
      expect(names).toHaveLength(1);
      expect(names[0].getValue()).toBe("Pedro");
    });

    it("should fail with name too short", () => {
      const nameResult = Name.create("A");

      expect(nameResult.isFailure()).toBe(true);
      expect(nameResult.getError()).toContain("al menos 2 caracteres");
    });

    it("should fail with name containing numbers", () => {
      const nameResult = Name.create("Pedro123");

      expect(nameResult.isFailure()).toBe(true);
      expect(nameResult.getError()).toContain("solo puede contener letras");
    });

    it("should accept names with accents", () => {
      const names = ["José", "María", "Ángel"];

      names.forEach((nameStr) => {
        const nameResult = Name.create(nameStr);
        expect(nameResult.isSuccess()).toBe(true);
      });
    });

    it("should trim whitespace", () => {
      const nameResult = Name.create("  Juan  ");

      expect(nameResult.isSuccess()).toBe(true);
      expect(nameResult.getValue().getValue()).toBe("Juan");
    });
  });

  describe("Password creation", () => {
    it("should create and store valid password", () => {
      const passwordResult = Password.create("SecurePass456");

      expect(passwordResult.isSuccess()).toBe(true);

      const password = passwordResult.getValue();
      const storage = InMemoryStorage.getInstance();
      storage.addPassword(password);

      const passwords = storage.getAllPasswords();
      expect(passwords).toHaveLength(1);
      expect(passwords[0].getValue()).toBe("SecurePass456");
      expect(passwords[0].toString()).toBe("********");
    });

    it("should fail with password too short", () => {
      const passwordResult = Password.create("Pass1");

      expect(passwordResult.isFailure()).toBe(true);
      expect(passwordResult.getError()).toContain("8 caracteres");
    });

    it("should fail without letter", () => {
      const passwordResult = Password.create("12345678");

      expect(passwordResult.isFailure()).toBe(true);
      expect(passwordResult.getError()).toContain("letra");
    });

    it("should fail without number", () => {
      const passwordResult = Password.create("PasswordOnly");

      expect(passwordResult.isFailure()).toBe(true);
      expect(passwordResult.getError()).toContain("número");
    });
  });

  describe("Multiple value objects", () => {
    it("should store multiple different value objects", () => {
      const storage = InMemoryStorage.getInstance();

      // Crear emails
      storage.addEmail(Email.create("email1@test.com").getValue());
      storage.addEmail(Email.create("email2@test.com").getValue());

      // Crear nombres
      storage.addName(Name.create("Jorge").getValue());
      storage.addName(Name.create("Maria").getValue());

      // Crear passwords
      storage.addPassword(Password.create("Pass1234").getValue());
      storage.addPassword(Password.create("Pass5678").getValue());

      expect(storage.getAllEmails()).toHaveLength(2);
      expect(storage.getAllNames()).toHaveLength(2);
      expect(storage.getAllPasswords()).toHaveLength(2);
    });
  });
});

import { describe, it, expect } from "vitest";
import { Email } from "./Email";

describe("Email", () => {
  describe("Create", () => {
    it("should succeed with valid email", () => {
      const emails = [
        "user@example.com",
        "test.user@domain.co.uk",
        "name+tag@company.org",
      ];

      emails.forEach((emailStr) => {
        const email = Email.create(emailStr);
        expect(email).toBeDefined();
      });
    });

    it("should fail with empty email", () => {
      const emails = ["", "   "];

      emails.forEach((emailStr) => {
        expect(() => Email.create(emailStr)).toThrow("vacío");
      });
    });

    it("should fail with invalid format", () => {
      const emails = [
        "invalid",
        "@example.com",
        "user@",
        "user @example.com",
        "user@domain",
      ];

      emails.forEach((emailStr) => {
        expect(() => Email.create(emailStr)).toThrow("formato");
      });
    });

    it("should normalize to lowercase", () => {
      const email = Email.create("User@Example.COM");
      expect(email.getValue()).toBe("user@example.com");
    });
  });

  describe("Domain", () => {
    it("should return correct domain", () => {
      const email = Email.create("user@example.com");
      expect(email.domain).toBe("example.com");
    });
  });

  describe("Equals", () => {
    it("should return true with equal emails", () => {
      const email1 = Email.create("user@example.com");
      const email2 = Email.create("user@example.com");

      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe("ToString", () => {
    it("should return email value", () => {
      const email = Email.create("user@example.com");
      expect(email.toString()).toBe("user@example.com");
    });
  });
});

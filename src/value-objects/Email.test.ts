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
        const result = Email.create(emailStr);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBeDefined();
      });
    });

    it("should fail with empty email", () => {
      const emails = ["", "   "];

      emails.forEach((emailStr) => {
        const result = Email.create(emailStr);
        expect(result.isFailure()).toBe(true);
        expect(result.getError()).toContain("vacío");
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
        const result = Email.create(emailStr);
        expect(result.isFailure()).toBe(true);
        expect(result.getError()).toContain("formato");
      });
    });

    it("should normalize to lowercase", () => {
      const result = Email.create("User@Example.COM");
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("user@example.com");
    });
  });

  describe("Domain", () => {
    it("should return correct domain", () => {
      const result = Email.create("user@example.com");
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().domain).toBe("example.com");
    });
  });

  describe("Equals", () => {
    it("should return true with equal emails", () => {
      const email1 = Email.create("user@example.com").getValue();
      const email2 = Email.create("user@example.com").getValue();

      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe("ToString", () => {
    it("should return email value", () => {
      const email = Email.create("user@example.com").getValue();
      expect(email.toString()).toBe("user@example.com");
    });
  });
});

import { describe, it, expect } from "vitest";
import { Password } from "./Password";

describe("Password", () => {
  describe("Create", () => {
    it("should succeed with valid password", () => {
      const password = Password.create("Password123");

      expect(password).toBeDefined();
      expect(password.getValue()).toBe("Password123");
    });

    it("should fail with empty password", () => {
      expect(() => Password.create("")).toThrow("vacía");
    });

    it("should fail with short password", () => {
      expect(() => Password.create("Pass1")).toThrow("8 caracteres");
    });

    it("should fail without letter", () => {
      expect(() => Password.create("12345678")).toThrow("letra");
    });

    it("should fail without number", () => {
      expect(() => Password.create("PasswordOnly")).toThrow("número");
    });
  });

  describe("Equals", () => {
    it("should return true with equal passwords", () => {
      const pwd1 = Password.create("Password123");
      const pwd2 = Password.create("Password123");

      expect(pwd1.equals(pwd2)).toBe(true);
    });
  });

  describe("Matches", () => {
    it("should return true with same string", () => {
      const password = Password.create("Password123");

      expect(password.matches("Password123")).toBe(true);
      expect(password.matches("Wrong456")).toBe(false);
    });
  });

  describe("ToString", () => {
    it("should not expose password value", () => {
      const password = Password.create("Password123");

      expect(password.toString()).toBe("********");
    });
  });
});

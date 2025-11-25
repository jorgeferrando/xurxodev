import { describe, it, expect } from "vitest";
import { Password } from "./Password";

describe("Password", () => {
  describe("Create", () => {
    it("should succeed with valid password", () => {
      const result = Password.create("Password123");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("Password123");
    });

    it("should fail with empty password", () => {
      const result = Password.create("");
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain("vacía");
    });

    it("should fail with short password", () => {
      const result = Password.create("Pass1");
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain("8 caracteres");
    });

    it("should fail without letter", () => {
      const result = Password.create("12345678");
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain("letra");
    });

    it("should fail without number", () => {
      const result = Password.create("PasswordOnly");
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain("número");
    });
  });

  describe("Equals", () => {
    it("should return true with equal passwords", () => {
      const pwd1 = Password.create("Password123").getValue();
      const pwd2 = Password.create("Password123").getValue();

      expect(pwd1.equals(pwd2)).toBe(true);
    });
  });

  describe("Matches", () => {
    it("should return true with same string", () => {
      const password = Password.create("Password123").getValue();

      expect(password.matches("Password123")).toBe(true);
      expect(password.matches("Wrong456")).toBe(false);
    });
  });

  describe("ToString", () => {
    it("should not expose password value", () => {
      const password = Password.create("Password123").getValue();

      expect(password.toString()).toBe("********");
    });
  });
});

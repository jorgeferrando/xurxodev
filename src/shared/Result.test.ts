import { describe, it, expect } from "vitest";
import { Result } from "./Result";

describe("Result", () => {
  describe("ok", () => {
    it("should create a successful result with value", () => {
      const result = Result.ok(42);

      expect(result.isSuccess()).toBe(true);
      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toBe(42);
    });

    it("should create a successful result with string", () => {
      const result = Result.ok("hello");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toBe("hello");
    });

    it("should create a successful result with object", () => {
      const obj = { name: "Jorge", age: 30 };
      const result = Result.ok(obj);

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toEqual(obj);
    });
  });

  describe("fail", () => {
    it("should create a failed result with error message", () => {
      const result = Result.fail<number>("Something went wrong");

      expect(result.isSuccess()).toBe(false);
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe("Something went wrong");
    });

    it("should create a failed result with custom error", () => {
      const result = Result.fail<string>("Invalid email format");

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe("Invalid email format");
    });
  });

  describe("getValue", () => {
    it("should return value when result is success", () => {
      const result = Result.ok(100);

      expect(result.getValue()).toBe(100);
    });

    it("should throw error when result is failure", () => {
      const result = Result.fail<number>("Error");

      expect(() => result.getValue()).toThrow("Cannot get value from a failed result");
    });
  });

  describe("getError", () => {
    it("should return error when result is failure", () => {
      const result = Result.fail<number>("Something failed");

      expect(result.getError()).toBe("Something failed");
    });

    it("should throw error when result is success", () => {
      const result = Result.ok(42);

      expect(() => result.getError()).toThrow("Cannot get error from a successful result");
    });
  });

  describe("isSuccess and isFailure", () => {
    it("should return correct boolean for success result", () => {
      const result = Result.ok("value");

      expect(result.isSuccess()).toBe(true);
      expect(result.isFailure()).toBe(false);
    });

    it("should return correct boolean for failure result", () => {
      const result = Result.fail<string>("error");

      expect(result.isSuccess()).toBe(false);
      expect(result.isFailure()).toBe(true);
    });
  });

  describe("Type safety", () => {
    it("should work with different types", () => {
      const numberResult: Result<number> = Result.ok(42);
      const stringResult: Result<string> = Result.ok("hello");
      const boolResult: Result<boolean> = Result.ok(true);

      expect(numberResult.getValue()).toBe(42);
      expect(stringResult.getValue()).toBe("hello");
      expect(boolResult.getValue()).toBe(true);
    });

    it("should maintain type when failing", () => {
      const result: Result<number> = Result.fail("error");

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe("error");
    });
  });
});

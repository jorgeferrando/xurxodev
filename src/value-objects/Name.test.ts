import { describe, it, expect } from "vitest";
import { Name } from "./Name";

describe("Name", () => {
  describe("Create", () => {
    it("should succeed with valid name", () => {
      const names = ["Juan", "María", "José", "Ana", "Juan Carlos", "María José"];

      names.forEach((nameStr) => {
        const result = Name.create(nameStr);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBeDefined();
      });
    });

    it("should fail with empty name", () => {
      const names = ["", "   "];

      names.forEach((nameStr) => {
        const result = Name.create(nameStr);
        expect(result.isFailure()).toBe(true);
        expect(result.getError()).toContain("vacío");
      });
    });

    it("should fail with one letter", () => {
      const names = ["A", "J"];

      names.forEach((nameStr) => {
        const result = Name.create(nameStr);
        expect(result.isFailure()).toBe(true);
        expect(result.getError()).toContain("al menos 2 caracteres");
      });
    });

    it("should fail with non-letters", () => {
      const names = [
        "Juan123",
        "María@",
        "José-Antonio",
        "Ana.María",
        "User_123",
      ];

      names.forEach((nameStr) => {
        const result = Name.create(nameStr);
        expect(result.isFailure()).toBe(true);
        expect(result.getError()).toContain("solo puede contener letras");
      });
    });

    it("should trim whitespace", () => {
      const result = Name.create("  Juan  ");
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("Juan");
    });

    it("should succeed with accents", () => {
      const names = ["José", "María", "Ángel"];

      names.forEach((nameStr) => {
        const result = Name.create(nameStr);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBeDefined();
      });
    });
  });

  describe("Equals", () => {
    it("should return true with equal names", () => {
      const name1 = Name.create("Juan").getValue();
      const name2 = Name.create("Juan").getValue();

      expect(name1.equals(name2)).toBe(true);
    });

    it("should return false with different names", () => {
      const name1 = Name.create("Juan").getValue();
      const name2 = Name.create("María").getValue();

      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe("ToString", () => {
    it("should return name value", () => {
      const name = Name.create("Juan Carlos").getValue();
      expect(name.toString()).toBe("Juan Carlos");
    });
  });
});

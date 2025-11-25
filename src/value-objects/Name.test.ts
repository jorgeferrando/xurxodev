import { describe, it, expect } from "vitest";
import { Name } from "./Name";

describe("Name", () => {
  describe("Create", () => {
    it("should succeed with valid name", () => {
      const names = ["Juan", "María", "José", "Ana", "Juan Carlos", "María José"];

      names.forEach((nameStr) => {
        const name = Name.create(nameStr);
        expect(name).toBeDefined();
      });
    });

    it("should fail with empty name", () => {
      const names = ["", "   "];

      names.forEach((nameStr) => {
        expect(() => Name.create(nameStr)).toThrow("vacío");
      });
    });

    it("should fail with one letter", () => {
      const names = ["A", "J"];

      names.forEach((nameStr) => {
        expect(() => Name.create(nameStr)).toThrow("al menos 2 caracteres");
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
        expect(() => Name.create(nameStr)).toThrow("solo puede contener letras");
      });
    });

    it("should trim whitespace", () => {
      const name = Name.create("  Juan  ");
      expect(name.getValue()).toBe("Juan");
    });

    it("should succeed with accents", () => {
      const names = ["José", "María", "Ángel"];

      names.forEach((nameStr) => {
        const name = Name.create(nameStr);
        expect(name).toBeDefined();
      });
    });
  });

  describe("Equals", () => {
    it("should return true with equal names", () => {
      const name1 = Name.create("Juan");
      const name2 = Name.create("Juan");

      expect(name1.equals(name2)).toBe(true);
    });

    it("should return false with different names", () => {
      const name1 = Name.create("Juan");
      const name2 = Name.create("María");

      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe("ToString", () => {
    it("should return name value", () => {
      const name = Name.create("Juan Carlos");
      expect(name.toString()).toBe("Juan Carlos");
    });
  });
});

import { describe, it, expect } from "vitest";
import { User } from "./User";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";

describe("User", () => {
  const createEmail = () => Email.create("user@example.com").getValue();
  const createName = () => Name.create("Juan").getValue();
  const createPassword = () => Password.create("Password123").getValue();

  describe("Create", () => {
    it("should generate UUID with valid data", () => {
      const email = createEmail();
      const name = createName();
      const password = createPassword();

      const result = User.create(email, name, password);

      expect(result.isSuccess()).toBe(true);
      const user = result.getValue();
      expect(user.id).toBeDefined();
      expect(user.id.length).toBeGreaterThan(0);
      expect(user.email).toBe(email);
      expect(user.name).toBe(name);
      expect(user.password).toBe(password);
    });

    it("should have different UUIDs for two users", () => {
      const user1 = User.create(createEmail(), createName(), createPassword()).getValue();
      const user2 = User.create(createEmail(), createName(), createPassword()).getValue();

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe("Reconstruct", () => {
    it("should succeed with valid data", () => {
      const id = "550e8400-e29b-41d4-a716-446655440000";
      const email = createEmail();
      const name = createName();
      const password = createPassword();

      const result = User.reconstruct(id, email, name, password);

      expect(result.isSuccess()).toBe(true);
      const user = result.getValue();
      expect(user.id).toBe(id);
      expect(user.email).toBe(email);
      expect(user.name).toBe(name);
      expect(user.password).toBe(password);
    });

    it("should fail with empty id", () => {
      const result = User.reconstruct("", createEmail(), createName(), createPassword());
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain("El ID no puede ser vacío");
    });

    it("should fail with whitespace id", () => {
      const result = User.reconstruct("   ", createEmail(), createName(), createPassword());
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain("El ID no puede ser vacío");
    });
  });

  describe("UpdateEmail", () => {
    it("should update with valid email", () => {
      const user = User.create(createEmail(), createName(), createPassword()).getValue();
      const newEmail = Email.create("newemail@example.com").getValue();

      const result = user.updateEmail(newEmail);

      expect(result.isSuccess()).toBe(true);
      expect(user.email).toBe(newEmail);
    });
  });

  describe("UpdateName", () => {
    it("should update with valid name", () => {
      const user = User.create(createEmail(), createName(), createPassword()).getValue();
      const newName = Name.create("Pedro").getValue();

      const result = user.updateName(newName);

      expect(result.isSuccess()).toBe(true);
      expect(user.name).toBe(newName);
    });
  });

  describe("UpdatePassword", () => {
    it("should update with valid password", () => {
      const user = User.create(createEmail(), createName(), createPassword()).getValue();
      const newPassword = Password.create("NewPass456").getValue();

      const result = user.updatePassword(newPassword);

      expect(result.isSuccess()).toBe(true);
      expect(user.password).toBe(newPassword);
    });
  });

  describe("Equals", () => {
    it("should return true with same UUID", () => {
      const id = "550e8400-e29b-41d4-a716-446655440000";
      const user1 = User.reconstruct(id, createEmail(), createName(), createPassword()).getValue();
      const user2 = User.reconstruct(
        id,
        Email.create("different@example.com").getValue(),
        Name.create("Maria").getValue(),
        createPassword()
      ).getValue();

      expect(user1.equals(user2)).toBe(true);
    });

    it("should return false with different UUID", () => {
      const user1 = User.create(createEmail(), createName(), createPassword()).getValue();
      const user2 = User.create(createEmail(), createName(), createPassword()).getValue();

      expect(user1.equals(user2)).toBe(false);
    });

    it("should return false with same properties but different UUID", () => {
      const email = createEmail();
      const name = createName();
      const password = createPassword();

      const user1 = User.create(email, name, password).getValue();
      const user2 = User.create(email, name, password).getValue();

      expect(user1.equals(user2)).toBe(false);
    });
  });

  describe("ToString", () => {
    it("should contain user info", () => {
      const user = User.create(createEmail(), createName(), createPassword()).getValue();
      const str = user.toString();

      expect(str).toContain(user.id);
      expect(str).toContain("Juan");
      expect(str).toContain("user@example.com");
      expect(str).not.toContain("Password123");
    });
  });
});

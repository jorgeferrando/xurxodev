import { Result } from "../shared/Result";

/**
 * Value Object Password with validation using Result monad
 * Invariants: minimum 8 characters, at least one letter and one number
 */
export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<Password> {
    if (!value || value.trim().length === 0) {
      return Result.fail("La contraseña no puede estar vacía");
    }

    if (value.length < 8) {
      return Result.fail("La contraseña debe tener al menos 8 caracteres");
    }

    if (!/[a-zA-Z]/.test(value)) {
      return Result.fail("La contraseña debe contener al menos una letra");
    }

    if (!/\d/.test(value)) {
      return Result.fail("La contraseña debe contener al menos un número");
    }

    return Result.ok(new Password(value));
  }

  matches(plainPassword: string): boolean {
    return this.value === plainPassword;
  }

  equals(other: Password): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return "********";
  }

  getValue(): string {
    return this.value;
  }
}

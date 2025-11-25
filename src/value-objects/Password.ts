/**
 * Value Object Password with validation
 * Invariants: minimum 8 characters, at least one letter and one number
 */
export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Password {
    if (!value || value.trim().length === 0) {
      throw new Error("La contraseña no puede estar vacía");
    }

    if (value.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    if (!/[a-zA-Z]/.test(value)) {
      throw new Error("La contraseña debe contener al menos una letra");
    }

    if (!/\d/.test(value)) {
      throw new Error("La contraseña debe contener al menos un número");
    }

    return new Password(value);
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

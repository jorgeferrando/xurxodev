/**
 * Value Object Name with validation
 * Invariants: minimum 2 characters, only letters
 */
export class Name {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Name {
    if (!value || value.trim().length === 0) {
      throw new Error("El nombre no puede estar vacío");
    }

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      throw new Error("El nombre debe tener al menos 2 caracteres");
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) {
      throw new Error("El nombre solo puede contener letras");
    }

    return new Name(trimmed);
  }

  equals(other: Name): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}

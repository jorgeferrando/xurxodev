/**
 * Value Object Email with validation
 */
export class Email {
  private readonly value: string;
  private static readonly EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new Error("El email no puede estar vacío");
    }

    if (!Email.EMAIL_REGEX.test(value)) {
      throw new Error("El formato del email no es válido");
    }

    const normalizedValue = value.toLowerCase().trim();
    return new Email(normalizedValue);
  }

  get domain(): string {
    return this.value.split("@")[1];
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}

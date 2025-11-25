import { Result } from "../shared/Result";

/**
 * Value Object Email with validation using Result monad
 */
export class Email {
  private readonly value: string;
  private static readonly EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<Email> {
    if (!value || value.trim().length === 0) {
      return Result.fail("El email no puede estar vacío");
    }

    if (!Email.EMAIL_REGEX.test(value)) {
      return Result.fail("El formato del email no es válido");
    }

    const normalizedValue = value.toLowerCase().trim();
    return Result.ok(new Email(normalizedValue));
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

import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";
import { randomUUID } from "crypto";

/**
 * Entity User with identity based on UUID
 * Two users are equal if they have the same UUID
 */
export class User {
  public readonly id: string;
  private _email: Email;
  private _name: Name;
  private _password: Password;

  get email(): Email {
    return this._email;
  }

  get name(): Name {
    return this._name;
  }

  get password(): Password {
    return this._password;
  }

  private constructor(id: string, email: Email, name: Name, password: Password) {
    this.id = id;
    this._email = email;
    this._name = name;
    this._password = password;
  }

  static create(email: Email, name: Name, password: Password): User {
    const id = randomUUID();
    return new User(id, email, name, password);
  }

  static reconstruct(
    id: string,
    email: Email,
    name: Name,
    password: Password
  ): User {
    if (!id || id.trim().length === 0) {
      throw new Error("El ID no puede ser vacío");
    }

    return new User(id, email, name, password);
  }

  updateEmail(newEmail: Email): void {
    this._email = newEmail;
  }

  updateName(newName: Name): void {
    this._name = newName;
  }

  updatePassword(newPassword: Password): void {
    this._password = newPassword;
  }

  equals(other: User): boolean {
    return this.id === other.id;
  }

  toString(): string {
    return `User { Id: ${this.id}, Name: ${this.name}, Email: ${this.email} }`;
  }
}

import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";
import { UserRepository } from "./UserRepository";

/**
 * In-memory implementation of UserRepository
 */
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  save(user: User): void {
    const existingIndex = this.users.findIndex((u) => u.id === user.id);

    if (existingIndex >= 0) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
  }

  findAll(): User[] {
    return [...this.users];
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.getValue() === email.toLowerCase().trim());
  }
}

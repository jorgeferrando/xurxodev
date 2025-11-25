import { User } from "../entities/User";
import { UserRepository } from "./UserRepository";
import { InMemoryStorage } from "../storage/InMemoryStorage";

/**
 * User repository implementation using InMemoryStorage
 * This is an adapter that connects the use cases with the existing storage
 */
export class StorageUserRepository implements UserRepository {
  constructor(private readonly storage: InMemoryStorage) {}

  save(user: User): void {
    this.storage.addUser(user);
  }

  findAll(): User[] {
    return this.storage.getAllUsers();
  }

  findByEmail(email: string): User | undefined {
    const allUsers = this.storage.getAllUsers();
    return allUsers.find((u) => u.email.getValue() === email.toLowerCase().trim());
  }
}

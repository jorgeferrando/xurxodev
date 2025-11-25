import { User } from "../entities/User";

/**
 * Repository interface for User persistence
 */
export interface UserRepository {
  save(user: User): void;
  findAll(): User[];
  findByEmail(email: string): User | undefined;
}

import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

/**
 * Use case: Get all users
 */
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(): User[] {
    return this.userRepository.findAll();
  }
}

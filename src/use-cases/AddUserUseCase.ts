import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";
import { UserRepository } from "../repositories/UserRepository";

export type AddUserRequest = {
  email: string;
  name: string;
  password: string;
};

/**
 * Use case: Add a new user
 * Business rules:
 * - Cannot add two users with the same email
 * - Only one user per domain can exist (e.g., one user with gmail, etc.)
 */
export class AddUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(request: AddUserRequest): User {
    const email = Email.create(request.email);
    const name = Name.create(request.name);
    const password = Password.create(request.password);

    this.validateBusinessRules(email);

    const user = User.create(email, name, password);
    this.userRepository.save(user);

    return user;
  }

  private validateBusinessRules(email: Email): void {
    const existingUserWithEmail = this.userRepository.findByEmail(email.getValue());
    if (existingUserWithEmail) {
      throw new Error(
        `No se puede añadir un usuario: ya existe un usuario con el email ${email.getValue()}`
      );
    }

    const domain = email.domain;
    const allUsers = this.userRepository.findAll();
    const userWithSameDomain = allUsers.find((user) => user.email.domain === domain);

    if (userWithSameDomain) {
      throw new Error(
        `No se puede añadir un usuario: ya existe un usuario con el dominio ${domain}`
      );
    }
  }
}

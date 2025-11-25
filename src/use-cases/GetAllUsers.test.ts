import { describe, it, expect, beforeEach } from "vitest";
import { GetAllUsers } from "./GetAllUsers";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";

describe("GetAllUsers", () => {
  let userRepository: InMemoryUserRepository;
  let getAllUsers: GetAllUsers;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    getAllUsers = new GetAllUsers(userRepository);
  });

  it("debería devolver una lista vacía cuando no hay usuarios", () => {
    const users = getAllUsers.execute();

    expect(users).toEqual([]);
  });

  it("debería devolver todos los usuarios almacenados", () => {
    const user1 = User.create(
      Email.create("user1@gmail.com"),
      Name.create("User One"),
      Password.create("Password1")
    );
    const user2 = User.create(
      Email.create("user2@yahoo.com"),
      Name.create("User Two"),
      Password.create("Password2")
    );

    userRepository.save(user1);
    userRepository.save(user2);

    const users = getAllUsers.execute();

    expect(users).toHaveLength(2);
    expect(users).toContainEqual(user1);
    expect(users).toContainEqual(user2);
  });

  it("debería devolver una copia de la lista de usuarios", () => {
    const user = User.create(
      Email.create("user@test.com"),
      Name.create("Test User"),
      Password.create("Password1")
    );

    userRepository.save(user);

    const users1 = getAllUsers.execute();
    const users2 = getAllUsers.execute();

    expect(users1).not.toBe(users2);
    expect(users1).toEqual(users2);
  });
});

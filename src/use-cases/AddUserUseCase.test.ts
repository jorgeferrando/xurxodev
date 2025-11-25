import { describe, it, expect, beforeEach } from "vitest";
import { AddUserUseCase } from "./AddUserUseCase";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";

describe("AddUserUseCase", () => {
  let userRepository: InMemoryUserRepository;
  let addUser: AddUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    addUser = new AddUserUseCase(userRepository);
  });

  it("debería añadir un usuario nuevo correctamente", () => {
    const request = {
      email: "user@example.com",
      name: "John Doe",
      password: "Password123",
    };

    const user = addUser.execute(request);

    expect(user).toBeInstanceOf(User);
    expect(user.email.getValue()).toBe("user@example.com");
    expect(user.name.getValue()).toBe("John Doe");
    expect(user.password.getValue()).toBe("Password123");

    const allUsers = userRepository.findAll();
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0]).toBe(user);
  });

  it("debería lanzar un error si el email ya existe", () => {
    const email = "duplicate@test.com";

    userRepository.save(
      User.create(
        Email.create(email),
        Name.create("First User"),
        Password.create("Password1")
      )
    );

    expect(() =>
      addUser.execute({
        email: email,
        name: "Second User",
        password: "Password2",
      })
    ).toThrow(`No se puede añadir un usuario: ya existe un usuario con el email ${email}`);
  });

  it("debería lanzar un error si el email ya existe (case insensitive)", () => {
    const email = "test@example.com";

    userRepository.save(
      User.create(
        Email.create(email.toLowerCase()),
        Name.create("First User"),
        Password.create("Password1")
      )
    );

    expect(() =>
      addUser.execute({
        email: email.toUpperCase(),
        name: "Second User",
        password: "Password2",
      })
    ).toThrow(
      `No se puede añadir un usuario: ya existe un usuario con el email ${email.toLowerCase()}`
    );
  });

  it("debería lanzar un error si ya existe un usuario con el mismo dominio", () => {
    userRepository.save(
      User.create(
        Email.create("user1@gmail.com"),
        Name.create("First User"),
        Password.create("Password1")
      )
    );

    expect(() =>
      addUser.execute({
        email: "user2@gmail.com",
        name: "Second User",
        password: "Password2",
      })
    ).toThrow("No se puede añadir un usuario: ya existe un usuario con el dominio gmail.com");
  });

  it("debería permitir añadir usuarios con dominios diferentes", () => {
    const user1 = addUser.execute({
      email: "user@gmail.com",
      name: "Gmail User",
      password: "Password1",
    });

    const user2 = addUser.execute({
      email: "user@yahoo.com",
      name: "Yahoo User",
      password: "Password2",
    });

    const allUsers = userRepository.findAll();
    expect(allUsers).toHaveLength(2);
    expect(allUsers).toContainEqual(user1);
    expect(allUsers).toContainEqual(user2);
  });

  it("debería validar las reglas del email", () => {
    expect(() =>
      addUser.execute({
        email: "invalid-email",
        name: "Test User",
        password: "Password1",
      })
    ).toThrow("El formato del email no es válido");
  });

  it("debería validar las reglas del nombre", () => {
    expect(() =>
      addUser.execute({
        email: "user@test.com",
        name: "A",
        password: "Password1",
      })
    ).toThrow("El nombre debe tener al menos 2 caracteres");
  });

  it("debería validar las reglas de la contraseña", () => {
    expect(() =>
      addUser.execute({
        email: "user@test.com",
        name: "Test User",
        password: "weak",
      })
    ).toThrow("La contraseña debe tener al menos 8 caracteres");
  });
});

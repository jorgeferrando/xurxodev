#!/usr/bin/env node

import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";
import { InMemoryStorage } from "../storage/InMemoryStorage";

function createUser(name: string, email: string, password: string): void {
  const nameResult = Name.create(name);
  if (nameResult.isFailure()) {
    console.error("✗ Error al crear nombre:", nameResult.getError());
    process.exit(1);
  }

  const emailResult = Email.create(email);
  if (emailResult.isFailure()) {
    console.error("✗ Error al crear email:", emailResult.getError());
    process.exit(1);
  }

  const passwordResult = Password.create(password);
  if (passwordResult.isFailure()) {
    console.error("✗ Error al crear contraseña:", passwordResult.getError());
    process.exit(1);
  }

  const userResult = User.create(
    emailResult.getValue(),
    nameResult.getValue(),
    passwordResult.getValue()
  );

  if (userResult.isFailure()) {
    console.error("✗ Error al crear usuario:", userResult.getError());
    process.exit(1);
  }

  const user = userResult.getValue();
  const storage = InMemoryStorage.getInstance();
  storage.addUser(user);

  console.log("✓ Usuario creado exitosamente:");
  console.log(`  ID: ${user.id}`);
  console.log(`  Nombre: ${user.name}`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Password: ${user.password}`);
}

const args = process.argv.slice(2);

if (args.length !== 3) {
  console.error("Uso: create-user <nombre> <email> <password>");
  console.error("Ejemplo: create-user Jorge jorge@google.com Password123");
  process.exit(1);
}

const [name, email, password] = args;
createUser(name, email, password);

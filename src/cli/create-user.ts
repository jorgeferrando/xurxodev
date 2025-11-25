#!/usr/bin/env node

import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";
import { InMemoryStorage } from "../storage/InMemoryStorage";

function createUser(name: string, email: string, password: string): void {
  try {
    const userName = Name.create(name);
    const userEmail = Email.create(email);
    const userPassword = Password.create(password);
    const user = User.create(userEmail, userName, userPassword);

    const storage = InMemoryStorage.getInstance();
    storage.addUser(user);

    console.log("✓ Usuario creado exitosamente:");
    console.log(`  ID: ${user.id}`);
    console.log(`  Nombre: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
  } catch (error) {
    console.error("✗ Error:", (error as Error).message);
    process.exit(1);
  }
}

const args = process.argv.slice(2);

if (args.length !== 3) {
  console.error("Uso: create-user <nombre> <email> <password>");
  console.error("Ejemplo: create-user Jorge jorge@google.com Password123");
  process.exit(1);
}

const [name, email, password] = args;
createUser(name, email, password);

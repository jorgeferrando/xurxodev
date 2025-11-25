#!/usr/bin/env node

import { InMemoryStorage } from "../storage/InMemoryStorage";
import { StorageUserRepository } from "../repositories/StorageUserRepository";
import { AddUser } from "../use-cases/AddUser";

function createUser(name: string, email: string, password: string): void {
  try {
    const storage = InMemoryStorage.getInstance();
    const userRepository = new StorageUserRepository(storage);
    const addUser = new AddUser(userRepository);

    const user = addUser.execute({ email, name, password });

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

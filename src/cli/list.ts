#!/usr/bin/env node

import { InMemoryStorage } from "../storage/InMemoryStorage";

type ListType = "all" | "users" | "emails" | "names" | "passwords";

function listItems(type: ListType): void {
  const storage = InMemoryStorage.getInstance();

  if (type === "all" || type === "users") {
    const users = storage.getAllUsers();
    console.log("\n=== USUARIOS ===");
    if (users.length === 0) {
      console.log("  (ninguno)");
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.toString()}`);
      });
    }
  }

  if (type === "all" || type === "emails") {
    const emails = storage.getAllEmails();
    console.log("\n=== EMAILS ===");
    if (emails.length === 0) {
      console.log("  (ninguno)");
    } else {
      emails.forEach((email, index) => {
        console.log(
          `${index + 1}. ${email.getValue()} (dominio: ${email.domain})`
        );
      });
    }
  }

  if (type === "all" || type === "names") {
    const names = storage.getAllNames();
    console.log("\n=== NOMBRES ===");
    if (names.length === 0) {
      console.log("  (ninguno)");
    } else {
      names.forEach((name, index) => {
        console.log(`${index + 1}. ${name.getValue()}`);
      });
    }
  }

  if (type === "all" || type === "passwords") {
    const passwords = storage.getAllPasswords();
    console.log("\n=== PASSWORDS ===");
    if (passwords.length === 0) {
      console.log("  (ninguno)");
    } else {
      passwords.forEach((password, index) => {
        console.log(`${index + 1}. ${password.toString()} (${password.getValue()})`);
      });
    }
  }

  console.log("");
}

const args = process.argv.slice(2);
const type = args[0] as ListType || "all";

const validTypes = ["all", "users", "emails", "names", "passwords"];

if (!validTypes.includes(type)) {
  console.error(`✗ Tipo inválido: ${type}`);
  console.error("Tipos válidos: all, users, emails, names, passwords");
  console.error("Ejemplo: list all");
  console.error("Ejemplo: list users");
  process.exit(1);
}

listItems(type);

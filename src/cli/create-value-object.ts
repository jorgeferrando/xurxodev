#!/usr/bin/env node

import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";
import { InMemoryStorage } from "../storage/InMemoryStorage";

type ValueObjectType = "email" | "name" | "password";

function createValueObject(type: ValueObjectType, value: string): void {
  const storage = InMemoryStorage.getInstance();

  switch (type) {
    case "email": {
      const result = Email.create(value);
      if (result.isFailure()) {
        console.error(`✗ Error al crear email:`, result.getError());
        process.exit(1);
      }
      const email = result.getValue();
      storage.addEmail(email);
      console.log("✓ Email creado exitosamente:");
      console.log(`  Valor: ${email.getValue()}`);
      console.log(`  Dominio: ${email.domain}`);
      break;
    }

    case "name": {
      const result = Name.create(value);
      if (result.isFailure()) {
        console.error(`✗ Error al crear name:`, result.getError());
        process.exit(1);
      }
      const name = result.getValue();
      storage.addName(name);
      console.log("✓ Name creado exitosamente:");
      console.log(`  Valor: ${name.getValue()}`);
      break;
    }

    case "password": {
      const result = Password.create(value);
      if (result.isFailure()) {
        console.error(`✗ Error al crear password:`, result.getError());
        process.exit(1);
      }
      const password = result.getValue();
      storage.addPassword(password);
      console.log("✓ Password creado exitosamente:");
      console.log(`  Valor: ${password.getValue()}`);
      console.log(`  Mostrado como: ${password.toString()}`);
      break;
    }

    default:
      console.error(`✗ Tipo de value object desconocido: ${type}`);
      console.error("Tipos válidos: email, name, password");
      process.exit(1);
  }
}

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error("Uso: create-vo <tipo> <valor>");
  console.error("Tipos válidos: email, name, password");
  console.error("Ejemplos:");
  console.error("  create-vo email jorge@google.com");
  console.error("  create-vo name Jorge");
  console.error("  create-vo password Password123");
  process.exit(1);
}

const [type, value] = args;
createValueObject(type as ValueObjectType, value);

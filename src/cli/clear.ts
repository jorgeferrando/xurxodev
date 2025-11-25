#!/usr/bin/env node

import { InMemoryStorage } from "../storage/InMemoryStorage";

function clearStorage(): void {
  const storage = InMemoryStorage.getInstance();
  storage.clear();
  console.log("✓ Almacenamiento limpiado exitosamente");
}

clearStorage();

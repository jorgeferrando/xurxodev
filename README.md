# XurxoDev - Domain-Driven Design Project

A TypeScript project focused on Domain-Driven Design principles, implementing Value Objects and Entities with a simple, pragmatic architecture.

## Overview

This project demonstrates a practical approach to DDD in TypeScript, emphasizing simplicity and clean domain modeling. It includes fully tested Value Objects (Email, Name, Password) and a User Entity, along with CLI tools for interaction.

## Features

- **Value Objects**: Immutable, self-validating domain primitives
  - Email with format validation
  - Name with length constraints
  - Password with security rules
- **Entity**: User with unique identity (UUID)
- **In-Memory Storage**: Simple persistence with JSON file backup
- **CLI Tools**: Command-line interface for managing domain objects
- **Result Monad**: Type-safe error handling
- **Full Test Coverage**: Comprehensive unit tests using Vitest

## Project Structure

```
src/
├── value-objects/          # Value Objects del dominio
│   ├── Email.ts
│   ├── Name.ts
│   └── Password.ts
├── entities/               # Entidades del dominio
│   └── User.ts
├── storage/                # Persistencia simple
│   └── InMemoryStorage.ts
├── shared/                 # Shared utilities
│   └── Result.ts
└── cli/                    # CLI tools
    ├── create-user.ts
    ├── create-value-object.ts
    ├── list.ts
    └── clear.ts
```

## Installation

```bash
npm install
```

## Usage

### CLI Commands

Create a new user:
```bash
npm run create-user
```

Create individual Value Objects:
```bash
npm run create-vo
```

List all stored objects:
```bash
npm run list
```

Clear storage:
```bash
npm run clear
```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Code Quality

Lint code:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

Run all checks:
```bash
npm run check
```

## Domain Rules

### Email
- Must be a valid email format
- Case-insensitive comparison
- Immutable

### Name
- Minimum 2 characters
- Maximum 50 characters
- Immutable

### Password
- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Immutable

### User
- Unique identifier (UUID)
- Composed of Email, Name, and Password Value Objects
- Identity-based equality

## Architecture Philosophy

This project follows a **simple architecture** approach:

- ✅ Keep It Simple principle
- ✅ Domain-driven design fundamentals
- ✅ YAGNI (You Aren't Gonna Need It)
- ✅ Evolutionary architecture

See [SIMPLE-ARCHITECTURE.md](./SIMPLE-ARCHITECTURE.md) for detailed architecture documentation.

## Documentation

- [CLI Usage Guide](./CLI-USAGE.md)
- [Architecture Analysis](./ARCHITECTURE-ANALYSIS.md)
- [Simple Architecture](./SIMPLE-ARCHITECTURE.md)
- [Result Monad Documentation](./RESULT-MONAD.md)
- [Test Coverage](./TEST-COVERAGE.md)
- [Examples](./EXAMPLES.md)
- [C# to TypeScript Comparison](./CSHARP-TYPESCRIPT-COMPARISON.md)

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Testing**: Vitest
- **Linting/Formatting**: Biome
- **Task Runner**: tsx

## License

ISC

## Author

Jorge Ferrando (jorgeparent@gmail.com)

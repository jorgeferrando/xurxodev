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
- **Use Cases**: Application logic with business rules
  - AddUserUseCase: Add new users with domain validation
  - GetAllUsersUseCase: Retrieve all users
- **Repository Pattern**: Abstraction for data persistence
- **In-Memory Storage**: Simple persistence with JSON file backup
- **CLI Tools**: Command-line interface for managing domain objects
- **Exception-based Error Handling**: Simple and direct error handling
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
├── use-cases/              # Casos de uso (application logic)
│   ├── AddUserUseCase.ts
│   └── GetAllUsersUseCase.ts
├── repositories/           # Abstracci\u00f3n de persistencia
│   ├── UserRepository.ts
│   ├── InMemoryUserRepository.ts
│   └── StorageUserRepository.ts
├── storage/                # Persistencia simple
│   └── InMemoryStorage.ts
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

### Business Rules (Use Cases)
- **Cannot add duplicate emails**: Each email must be unique across all users
- **One user per domain**: Only one user can exist per email domain (e.g., only one @gmail.com user)

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
- [Test Coverage](./TEST-COVERAGE.md)
- [Examples](./EXAMPLES.md)

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

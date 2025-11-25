# Comparación: C# vs TypeScript

## Resumen

Los proyectos en **C#** (`csharp-example/Simple/`) y **TypeScript** (`src/`) son ahora **equivalentes** en arquitectura y patrones.

---

## Características Comunes

### ✅ Ambos Implementan:

1. **Result Monad** para manejo de errores sin excepciones
2. **Value Objects** (Email, Name, Password) inmutables
3. **Entity User** con identidad basada en UUID
4. **Constructor privado + Factory Method** estático (`Create`)
5. **Tests completos** con framework de testing
6. **Igualdad por valor** en Value Objects
7. **Igualdad por identidad** en Entity

---

## Comparación Lado a Lado

### Result Monad

#### C#
```csharp
public class Result<T>
{
    public static Result<T> Ok(T value)
    public static Result<T> Fail(string error)

    public bool IsSuccess()
    public bool IsFailure()
    public T GetValue()
    public string GetError()
}
```

#### TypeScript
```typescript
export class Result<T> {
    static ok<T>(value: T): Result<T>
    static fail<T>(error: string): Result<T>

    isSuccess(): boolean
    isFailure(): boolean
    getValue(): T
    getError(): string
}
```

**Diferencias:**
- C#: Métodos estáticos con PascalCase (`Ok`, `Fail`)
- TypeScript: Métodos estáticos con camelCase (`ok`, `fail`)
- Misma funcionalidad, diferente convención de nombres

---

### Value Object: Email

#### C#
```csharp
public sealed class Email : IEquatable<Email>
{
    private readonly string _value;

    private Email(string value) { _value = value; }

    public static Result<Email> Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return Result<Email>.Fail("El email no puede estar vacío");

        if (!EmailRegex.IsMatch(value))
            return Result<Email>.Fail("El formato del email no es válido");

        return Result<Email>.Ok(new Email(value.ToLowerInvariant().Trim()));
    }

    public string Domain => _value.Split('@')[1];
    public bool Equals(Email other) => other != null && _value == other._value;
    public string GetValue() => _value;
}
```

#### TypeScript
```typescript
export class Email {
    private readonly value: string;

    private constructor(value: string) { this.value = value; }

    static create(value: string): Result<Email> {
        if (!value || value.trim().length === 0) {
            return Result.fail("El email no puede estar vacío");
        }

        if (!Email.EMAIL_REGEX.test(value)) {
            return Result.fail("El formato del email no es válido");
        }

        return Result.ok(new Email(value.toLowerCase().trim()));
    }

    get domain(): string { return this.value.split("@")[1]; }
    equals(other: Email): boolean { return this.value === other.value; }
    getValue(): string { return this.value; }
}
```

**Diferencias:**
- C#: `sealed class`, implementa `IEquatable<Email>`
- TypeScript: No tiene sealed, igualdad manual
- C#: Property `Domain` (PascalCase)
- TypeScript: Getter `domain` (camelCase)
- Mismo comportamiento funcional

---

### Entity: User

#### C#
```csharp
public class User : IEquatable<User>
{
    public Guid Id { get; }
    private Email _email;
    private Name _name;
    private Password _password;

    public Email Email => _email;

    private User(Guid id, Email email, Name name, Password password) { ... }

    public static Result<User> Create(Email email, Name name, Password password)
    {
        var id = Guid.NewGuid();
        return Result<User>.Ok(new User(id, email, name, password));
    }

    public static Result<User> Reconstruct(Guid id, Email email, Name name, Password password)
    {
        if (id == Guid.Empty)
            return Result<User>.Fail("El ID no puede ser vacío");
        return Result<User>.Ok(new User(id, email, name, password));
    }

    public Result<bool> UpdateEmail(Email newEmail) { ... }
    public bool Equals(User other) => Id == other.Id;
}
```

#### TypeScript
```typescript
export class User {
    public readonly id: string;
    private _email: Email;
    private _name: Name;
    private _password: Password;

    get email(): Email { return this._email; }

    private constructor(id: string, email: Email, name: Name, password: Password) { ... }

    static create(email: Email, name: Name, password: Password): Result<User> {
        const id = randomUUID();
        return Result.ok(new User(id, email, name, password));
    }

    static reconstruct(id: string, email: Email, name: Name, password: Password): Result<User> {
        if (!id || id.trim().length === 0) {
            return Result.fail("El ID no puede ser vacío");
        }
        return Result.ok(new User(id, email, name, password));
    }

    updateEmail(newEmail: Email): Result<void> { ... }
    equals(other: User): boolean { return this.id === other.id; }
}
```

**Diferencias:**
- C#: `Guid` para UUID
- TypeScript: `string` para UUID (usa `randomUUID()` de crypto)
- C#: `Result<bool>` en updates
- TypeScript: `Result<void>` en updates
- C#: Implementa `IEquatable<User>` y operadores `==` / `!=`
- TypeScript: Solo método `equals()`

---

### Tests

#### C# (XUnit)
```csharp
[Fact]
public void Create_WithValidEmail_ShouldSucceed()
{
    var result = Email.Create("user@example.com");

    Assert.True(result.IsSuccess());
    Assert.NotNull(result.GetValue());
}

[Fact]
public void Create_WithEmptyEmail_ShouldFail()
{
    var result = Email.Create("");

    Assert.True(result.IsFailure());
    Assert.Contains("vacío", result.GetError());
}
```

#### TypeScript (Vitest)
```typescript
it("should succeed with valid email", () => {
    const result = Email.create("user@example.com");

    expect(result.isSuccess()).toBe(true);
    expect(result.getValue()).toBeDefined();
});

it("should fail with empty email", () => {
    const result = Email.create("");

    expect(result.isFailure()).toBe(true);
    expect(result.getError()).toContain("vacío");
});
```

**Diferencias:**
- C#: `[Fact]` attribute, `Assert.*`
- TypeScript: `it()` function, `expect()`
- Misma estructura y cobertura de tests

---

## Convenciones de Nomenclatura

| Concepto | C# | TypeScript |
|----------|-----|------------|
| **Clases** | PascalCase | PascalCase |
| **Métodos** | PascalCase | camelCase |
| **Propiedades** | PascalCase | camelCase |
| **Campos privados** | `_camelCase` | `_camelCase` |
| **Constantes** | PascalCase | UPPER_CASE |
| **Genéricos** | `<T>` | `<T>` |

---

## Características del Lenguaje

### C# Tiene:
- ✅ `sealed` keyword para prevenir herencia
- ✅ `IEquatable<T>` interface estándar
- ✅ Operadores sobrecargables (`==`, `!=`)
- ✅ Properties con sintaxis concisa
- ✅ `Guid` tipo nativo
- ✅ Atributos para tests (`[Fact]`, `[Theory]`)

### TypeScript Tiene:
- ✅ `readonly` en propiedades de clase
- ✅ Getters con sintaxis limpia
- ✅ Tipos union más flexibles
- ✅ Inferencia de tipos más agresiva
- ✅ `const` inmutable por defecto
- ✅ Template literals

---

## Estructura de Archivos

### C# (`csharp-example/Simple/`)
```
Simple/
├── Result.cs
├── Email.cs
├── Name.cs
├── Password.cs
├── User.cs
├── EmailTests.cs
├── NameTests.cs
├── PasswordTests.cs
└── UserTests.cs
```

### TypeScript (`src/`)
```
src/
├── shared/
│   ├── Result.ts
│   └── Result.test.ts
├── value-objects/
│   ├── Email.ts
│   ├── Email.test.ts
│   ├── Name.ts
│   ├── Name.test.ts
│   ├── Password.ts
│   └── Password.test.ts
├── entities/
│   ├── User.ts
│   └── User.test.ts
├── storage/
│   └── InMemoryStorage.ts
└── cli/
    ├── create-user.ts
    ├── create-value-object.ts
    ├── list.ts
    └── clear.ts
```

**Diferencias:**
- TypeScript: Estructura más organizada por capas
- TypeScript: Incluye storage y CLI
- C#: Todos los archivos en una carpeta (ejemplo simple)

---

## Equivalencia Funcional

### ✅ Ambos Proyectos:

1. **Result Monad**
   - API idéntica (solo difiere en naming)
   - Mismo comportamiento
   - Sin `map()` / `flatMap()` (YAGNI)

2. **Value Objects**
   - Constructor privado
   - Factory method estático
   - Inmutabilidad
   - Validación en construcción
   - Igualdad por valor

3. **Entity User**
   - Identidad basada en UUID
   - Factory methods: `Create` / `Reconstruct`
   - Métodos de actualización
   - Igualdad por identidad

4. **Tests**
   - Misma cobertura
   - Mismos casos de prueba
   - Validaciones equivalentes

---

## Conclusión

Los proyectos son **funcionalmente equivalentes**, con las únicas diferencias siendo:

1. **Convenciones de nomenclatura** del lenguaje
2. **Características específicas** del lenguaje (sealed, IEquatable, operadores)
3. **Estructura de carpetas** (TypeScript más organizado)
4. **Ecosistema adicional** en TypeScript (CLI, storage)

Ambos implementan los mismos **patrones de diseño** y **principios de arquitectura**:
- ✅ Result Monad (simplificado)
- ✅ Value Objects
- ✅ Entity con identidad
- ✅ Factory Method pattern
- ✅ Fail-fast validation
- ✅ Inmutabilidad
- ✅ Type safety

**Puedes aprender de ambos y aplicar los mismos conceptos en cualquier lenguaje.**

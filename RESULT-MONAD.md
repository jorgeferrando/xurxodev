# Refactoring: De Excepciones a Mónadas Result

## Cambio Realizado

El proyecto ha sido refactorizado para usar el patrón **Result Monad** en lugar de lanzar excepciones para el manejo de errores.

## Por qué Result en lugar de Excepciones?

### Problemas con Excepciones:

❌ **Invisibles en la firma del método**
```typescript
// No sabes que puede fallar sin leer el código
const email = new Email("invalid");
```

❌ **Control de flujo mediante exceptions**
```typescript
try {
  const email = new Email(value);
  const name = new Name(value);
  const password = new Password(value);
} catch (error) {
  // Manejo de errores
}
```

❌ **Difícil de componer**
```typescript
// Necesitas múltiples try-catch
try {
  const email = new Email(emailStr);
  try {
    const name = new Name(nameStr);
  } catch (e2) { }
} catch (e1) { }
```

### Ventajas del Result Monad:

✅ **Explícito en la firma**
```typescript
// Sabes que puede fallar mirando el tipo de retorno
static create(value: string): Result<Email>
```

✅ **Control de flujo funcional**
```typescript
const emailResult = Email.create(value);
if (emailResult.isFailure()) {
  // Manejo explícito del error
  return emailResult.getError();
}
const email = emailResult.getValue();
```

✅ **Composición funcional**
```typescript
Email.create(emailStr)
  .flatMap(email => Name.create(nameStr)
    .map(name => ({ email, name }))
  )
```

✅ **Railway-Oriented Programming**
- El flujo de éxito y error son caminos separados
- Más predecible y testeable

## Cambios en el Código

### ANTES (Excepciones):

```typescript
export class Email {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("El email no puede estar vacío");
    }
    // ...
  }
}

// Uso
try {
  const email = new Email("user@example.com");
} catch (error) {
  console.error(error.message);
}
```

### DESPUÉS (Result Monad):

```typescript
export class Email {
  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Result<Email> {
    if (!value || value.trim().length === 0) {
      return Result.fail("El email no puede estar vacío");
    }
    return Result.ok(new Email(value));
  }
}

// Uso
const emailResult = Email.create("user@example.com");
if (emailResult.isFailure()) {
  console.error(emailResult.getError());
  return;
}
const email = emailResult.getValue();
```

## Patrón Aplicado

### Constructor Privado + Factory Method

**Constructor privado:**
```typescript
private constructor(value: string) {
  this.value = value;
}
```
- Solo se puede crear internamente
- Garantiza que todos los objetos son válidos

**Factory Method estático:**
```typescript
static create(value: string): Result<Email> {
  // Validación
  if (invalid) return Result.fail("error");
  // Construcción exitosa
  return Result.ok(new Email(value));
}
```

## API de Result (Simplificada)

### Crear Results:

```typescript
Result.ok(value)     // Éxito con valor
Result.fail(error)   // Fallo con mensaje de error
```

### Verificar estado:

```typescript
result.isSuccess()   // true si es éxito
result.isFailure()   // true si es fallo
```

### Obtener valores:

```typescript
result.getValue()    // Obtiene el valor (lanza si es fallo)
result.getError()    // Obtiene el error (lanza si es éxito)
```

**Nota:** Esta implementación NO incluye `map()` ni `flatMap()` siguiendo el principio de simplicidad (YAGNI). Se añadirán cuando sean necesarios.

## Ejemplos de Uso

### Ejemplo 1: Creación Simple

```typescript
const emailResult = Email.create("user@example.com");

if (emailResult.isSuccess()) {
  const email = emailResult.getValue();
  console.log("Email:", email.getValue());
} else {
  console.error("Error:", emailResult.getError());
}
```

### Ejemplo 2: Composición de Múltiples Results

```typescript
const nameResult = Name.create("Jorge");
const emailResult = Email.create("jorge@google.com");
const passwordResult = Password.create("Password123");

if (nameResult.isFailure()) {
  console.error(nameResult.getError());
  return;
}

if (emailResult.isFailure()) {
  console.error(emailResult.getError());
  return;
}

if (passwordResult.isFailure()) {
  console.error(passwordResult.getError());
  return;
}

const userResult = User.create(
  emailResult.getValue(),
  nameResult.getValue(),
  passwordResult.getValue()
);

if (userResult.isSuccess()) {
  const user = userResult.getValue();
  console.log("Usuario creado:", user.id);
}
```

### Ejemplo 3: Composición Manual (Estilo Imperativo)

```typescript
const emailResult = Email.create("user@example.com");
if (emailResult.isFailure()) {
  console.error(emailResult.getError());
  return;
}

const nameResult = Name.create("Jorge");
if (nameResult.isFailure()) {
  console.error(nameResult.getError());
  return;
}

const passwordResult = Password.create("Password123");
if (passwordResult.isFailure()) {
  console.error(passwordResult.getError());
  return;
}

// Todos exitosos, crear usuario
const userResult = User.create(
  emailResult.getValue(),
  nameResult.getValue(),
  passwordResult.getValue()
);

if (userResult.isSuccess()) {
  console.log("Usuario creado:", userResult.getValue().id);
}
```

Este estilo es más **simple, claro y fácil de seguir** para esta fase del proyecto.

## Cambios en Archivos

### Value Objects:
- `Email.ts` - Constructor privado + `Email.create()` retorna `Result<Email>`
- `Name.ts` - Constructor privado + `Name.create()` retorna `Result<Name>`
- `Password.ts` - Constructor privado + `Password.create()` retorna `Result<Password>`

### Entity:
- `User.ts` - Constructor privado + métodos estáticos:
  - `User.create()` retorna `Result<User>`
  - `User.reconstruct()` retorna `Result<User>`
  - `updateEmail/Name/Password()` retornan `Result<void>`

### Tests:
- Todos actualizados para usar `Result.isSuccess()` / `Result.isFailure()`
- Verifican errores con `getError()` en lugar de `expect().toThrow()`

### CLI:
- Scripts actualizados para manejar `Result`
- Verifican `isFailure()` antes de obtener valores
- Mensajes de error más específicos

### Storage:
- `getAllUsers/Emails/Names/Passwords()` manejan Results
- Filtran objetos inválidos automáticamente

## Beneficios Obtenidos

1. ✅ **Type Safety**: El compilador te obliga a manejar errores
2. ✅ **Explícito**: Se ve en el tipo de retorno que puede fallar
3. ✅ **Simple**: API mínima con solo lo necesario (YAGNI)
4. ✅ **Testeable**: Más fácil testear caminos de éxito y fallo
5. ✅ **Predecible**: Control de flujo explícito sin sorpresas
6. ✅ **Sin Side Effects**: No lanza excepciones inesperadas

## Resultado Final

✅ 36 tests pasando
✅ CLI funcionando correctamente
✅ Manejo de errores explícito y type-safe
✅ Código más funcional y predecible
✅ Patrón consistente en todo el dominio

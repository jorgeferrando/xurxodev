# Arquitectura Simple - Fase Temprana de Desarrollo

## Filosofía: Keep It Simple

Este proyecto se encuentra en una **fase temprana de desarrollo** y sigue el principio de **simplicidad primero**. No necesitamos sobre-arquitecturar en esta etapa.

## Estructura Actual

```
src/
├── value-objects/          # Value Objects del dominio
│   ├── Email.ts
│   ├── Email.test.ts
│   ├── Name.ts
│   ├── Name.test.ts
│   ├── Password.ts
│   └── Password.test.ts
│
├── entities/               # Entidades del dominio
│   ├── User.ts
│   └── User.test.ts
│
├── use-cases/              # Casos de uso (application logic)
│   ├── AddUserUseCase.ts
│   ├── AddUserUseCase.test.ts
│   ├── GetAllUsersUseCase.ts
│   └── GetAllUsersUseCase.test.ts
│
├── repositories/           # Abstracción de persistencia
│   ├── UserRepository.ts
│   ├── InMemoryUserRepository.ts
│   └── StorageUserRepository.ts
│
├── storage/                # Persistencia simple
│   └── InMemoryStorage.ts
│
└── cli/                    # Interfaz de línea de comandos
    ├── create-user.ts
    ├── create-value-object.ts
    ├── list.ts
    └── clear.ts
```

## Capas

### 1. Dominio (Value Objects + Entities)
- **Value Objects**: Email, Name, Password
- **Entity**: User
- **Características**:
  - Inmutables (Value Objects)
  - Auto-validados
  - Sin dependencias externas (excepto crypto para UUID)
  - Reglas de negocio encapsuladas

### 2. Casos de Uso (Application Logic)
- **AddUserUseCase**: Añadir usuarios con validación de reglas de negocio
- **GetAllUsersUseCase**: Obtener lista de usuarios
- **Características**:
  - Orquestan la lógica de aplicación
  - Aplican reglas de negocio complejas
  - Independientes de la infraestructura (usan repositorios)

### 3. Repositories (Abstracción de Persistencia)
- **UserRepository**: Interfaz para persistencia de usuarios
- **InMemoryUserRepository**: Implementación en memoria
- **StorageUserRepository**: Adaptador para InMemoryStorage
- **Características**:
  - Abstracción sobre el almacenamiento
  - Permite intercambiar implementaciones
  - Facilita testing con mocks

### 4. Storage (Persistencia Simple)
- **InMemoryStorage**: Singleton con persistencia en JSON
- **Responsabilidades**:
  - Guardar y recuperar datos
  - Persistencia en archivo `.domain-storage.json`
  - Gestión de colecciones en memoria

### 5. CLI (Interfaz de Usuario)
- Scripts para interactuar con el sistema
- Manejo de entrada/salida
- Presentación de errores
- Utiliza casos de uso para ejecutar operaciones

## Principios Aplicados (Fase Simple)

### ✅ Lo que SÍ hacemos:

1. **Value Objects bien diseñados**
   - Inmutabilidad
   - Validación en construcción
   - Igualdad por valor

2. **Entity con identidad**
   - User tiene UUID único
   - Igualdad por identidad

3. **Separación básica de concerns**
   - Dominio separado de infraestructura
   - CLI separado de lógica de negocio

4. **Tests unitarios**
   - Cobertura del dominio
   - Validaciones probadas

5. **Casos de uso**
   - Lógica de aplicación separada
   - Reglas de negocio aplicadas en un lugar central
   - Reutilizable entre diferentes interfaces (CLI, API, etc.)

6. **Repository Pattern**
   - Abstracción para persistencia
   - Facilita testing
   - Permite cambiar implementaciones

### 🚫 Lo que NO hacemos (por ahora):

1. **No complejidad innecesaria**
   - No DTOs (usamos tipos simples)
   - No Result types (exceptions funcionan bien)
   - No inyección de dependencias compleja (constructores simples)

2. **No sobre-ingeniería**
   - InMemoryStorage hace múltiples cosas: OK para esta fase
   - Repositorios simples sin lógica compleja
   - No múltiples capas de abstracción

## Cuándo Refactorizar

### Señales para evolucionar la arquitectura:

1. **Múltiples implementaciones de persistencia**
   - Cuando necesitemos MongoDB además de JSON
   - → Entonces crear `IUserRepository`

2. **Lógica de aplicación compleja**
   - Cuando los CLI scripts se vuelvan muy largos
   - → Entonces crear Use Cases

3. **Reutilización entre capas**
   - Cuando necesitemos API REST además de CLI
   - → Entonces crear capa de Application

4. **Testing difícil**
   - Cuando no podamos mockear dependencias fácilmente
   - → Entonces introducir interfaces

5. **Múltiples clientes**
   - Cuando tengamos Web + Mobile + CLI
   - → Entonces aplicar Clean Architecture completa

## Ventajas de Esta Aproximación

### Para Desarrollo Temprano:

✅ **Rápido de desarrollar**
- Menos código que escribir
- Menos archivos que mantener
- Decisiones simples

✅ **Fácil de entender**
- Estructura plana y clara
- Menos abstracciones que aprender
- Código directo

✅ **Fácil de cambiar**
- Menos acoplamiento entre abstracciones
- Refactoring más sencillo
- Pivots rápidos

✅ **Menos errores**
- Menos lugares donde las cosas pueden fallar
- Menos interfaces que mantener sincronizadas
- Debugging más simple

## Comparación: Simple vs Over-Engineered

### Arquitectura Simple con Casos de Uso (Actual)
```typescript
// CLI → Use Case → Repository
const storage = InMemoryStorage.getInstance();
const userRepository = new StorageUserRepository(storage);
const addUser = new AddUserUseCase(userRepository);
const user = addUser.execute({ email, name, password });
```
**Líneas de código**: ~4-5
**Archivos involucrados**: 4
**Complejidad**: Baja-Media
**Ventajas**:
- Reglas de negocio centralizadas
- Fácil de testear
- Reutilizable

### Arquitectura Over-Engineered (Innecesaria ahora)
```typescript
// CLI → Use Case → Repository → Implementation
const createUserDTO = new CreateUserDTO(name, email, password);
const useCase = new CreateUserUseCase(
  container.resolve<IUserRepository>('UserRepository'),
  container.resolve<IIdGenerator>('IdGenerator')
);
const result = await useCase.execute(createUserDTO);
if (result.isSuccess()) {
  // ...
}
```
**Líneas de código**: ~15-20
**Archivos involucrados**: 7+
**Complejidad**: Alta

## YAGNI (You Aren't Gonna Need It)

Ya implementamos (justificado):
- ✅ Interfaces de repositorio (facilita testing y permite múltiples implementaciones)
- ✅ Casos de uso (centraliza reglas de negocio)

Aún no necesitamos:
- ❌ DTOs (conversiones directas)
- ❌ Result types o Either monads (exceptions simples funcionan bien)
- ❌ Dependency Injection container (constructores simples)
- ❌ Múltiples capas de abstracción innecesarias

## Deuda Técnica Aceptable

Esta arquitectura tiene **deuda técnica consciente**:

| Item | Estado | Cuando Refactorizar |
|------|--------|---------------------|
| InMemoryStorage viola SRP | 🟡 Aceptable | Cuando se vuelva muy complejo |
| Sin DI Container | 🟡 Aceptable | Múltiples configuraciones |
| Sin DTOs | 🟡 Aceptable | Necesidad de transformaciones complejas |

## Conclusión

### Filosofía de Desarrollo:

> "Make it work, make it right, make it fast - in that order"
> - Kent Beck

Estamos en la fase **"Make it work"**:
- ✅ Funciona correctamente
- ✅ Tests pasan
- ✅ Código limpio y legible
- ✅ Fácil de mantener en esta escala

Evolucionaremos a **"Make it right"** (SOLID + Clean Architecture) cuando:
- El proyecto crezca
- Tengamos requisitos más complejos
- Necesitemos múltiples implementaciones
- El dolor de mantenimiento lo justifique

### Para el Futuro

El archivo `ARCHITECTURE-ANALYSIS.md` documenta cómo evolucionar esta arquitectura cuando sea necesario. Por ahora, **simple es mejor**.

## Referencias

- YAGNI: https://martinfowler.com/bliki/Yagni.html
- Simplicity: https://www.extremeprogramming.org/rules/simple.html
- Technical Debt: https://martinfowler.com/bliki/TechnicalDebt.html

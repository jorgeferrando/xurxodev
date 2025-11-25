# CLI Usage Guide

Este proyecto incluye scripts de línea de comandos para crear y gestionar Value Objects y Entidades.

## Comandos Disponibles

### 1. Crear Usuario

Crea un usuario con los value objects Email, Name y Password:

```bash
npm run create-user <nombre> <email> <password>
```

**Ejemplo:**
```bash
npm run create-user Jorge jorge@google.com Password123
```

**Validaciones:**
- **Nombre**: Mínimo 2 caracteres, solo letras
- **Email**: Formato válido de email
- **Password**: Mínimo 8 caracteres, al menos una letra y un número

### 2. Crear Value Object

Crea un value object individual:

```bash
npm run create-vo <tipo> <valor>
```

**Tipos válidos:** `email`, `name`, `password`

**Ejemplos:**
```bash
npm run create-vo email maria@example.com
npm run create-vo name Pedro
npm run create-vo password SecurePass456
```

### 3. Listar Items

Lista todos los items creados o filtra por tipo:

```bash
npm run list [tipo]
```

**Tipos válidos:** `all`, `users`, `emails`, `names`, `passwords`

**Ejemplos:**
```bash
npm run list              # Lista todo
npm run list users        # Solo usuarios
npm run list emails       # Solo emails
npm run list names        # Solo nombres
npm run list passwords    # Solo passwords
```

### 4. Limpiar Almacenamiento

Elimina todos los items almacenados:

```bash
npm run clear
```

## Ejemplos de Uso Completo

```bash
# Crear algunos value objects
npm run create-vo email juan@example.com
npm run create-vo name Juan
npm run create-vo password Password123

# Crear usuarios
npm run create-user Jorge jorge@google.com 1234abcd
npm run create-user Maria maria@microsoft.com Pass9876

# Listar todo
npm run list

# Listar solo usuarios
npm run list users

# Limpiar todo
npm run clear
```

## Almacenamiento

Los datos se almacenan en un archivo `.domain-storage.json` en la raíz del proyecto. Este archivo persiste entre ejecuciones del CLI.

## Manejo de Errores

El CLI validará todos los inputs y mostrará mensajes de error descriptivos si:
- Los parámetros son inválidos
- Las validaciones de los Value Objects fallan
- Faltan argumentos requeridos

**Ejemplo de error:**
```bash
npm run create-user A a@test Pass1
# ✗ Error al crear usuario: El nombre debe tener al menos 2 caracteres
```

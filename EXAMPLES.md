# Ejemplos de Uso del CLI

## Ejemplo 1: Crear usuarios básicos

```bash
# Crear primer usuario
npm run create-user Jorge jorge@google.com Password123

# Crear segundo usuario
npm run create-user Maria maria@microsoft.com SecurePass456

# Ver todos los usuarios
npm run list users
```

**Salida esperada:**
```
=== USUARIOS ===

1. User { Id: <uuid>, Name: Jorge, Email: jorge@google.com }
2. User { Id: <uuid>, Name: Maria, Email: maria@microsoft.com }
```

## Ejemplo 2: Crear value objects individuales

```bash
# Crear varios emails
npm run create-vo email admin@company.com
npm run create-vo email support@company.com
npm run create-vo email info@company.com

# Crear varios nombres
npm run create-vo name Pedro
npm run create-vo name Ana
npm run create-vo name Carlos

# Crear passwords
npm run create-vo password MySecure123
npm run create-vo password AnotherPass456

# Ver solo los emails
npm run list emails

# Ver solo los nombres
npm run list names

# Ver solo las passwords
npm run list passwords
```

## Ejemplo 3: Validaciones - Errores comunes

```bash
# Email inválido
npm run create-vo email invalidemail
# ✗ Error al crear email: El formato del email no es válido

# Nombre muy corto
npm run create-vo name A
# ✗ Error al crear name: El nombre debe tener al menos 2 caracteres

# Nombre con números
npm run create-vo name Juan123
# ✗ Error al crear name: El nombre solo puede contener letras

# Password muy corta
npm run create-vo password Pass1
# ✗ Error al crear password: La contraseña debe tener al menos 8 caracteres

# Password sin números
npm run create-vo password OnlyLetters
# ✗ Error al crear password: La contraseña debe contener al menos un número

# Password sin letras
npm run create-vo password 12345678
# ✗ Error al crear password: La contraseña debe contener al menos una letra
```

## Ejemplo 4: Workflow completo

```bash
# 1. Limpiar datos anteriores
npm run clear

# 2. Crear usuarios de un equipo
npm run create-user "Jorge García" jorge@company.com Admin123
npm run create-user "María López" maria@company.com Manager456
npm run create-user "Pedro Sánchez" pedro@company.com Developer789

# 3. Crear algunos value objects adicionales
npm run create-vo email contact@company.com
npm run create-vo email sales@company.com
npm run create-vo name "Ana María"
npm run create-vo password TempPass999

# 4. Ver todo
npm run list

# 5. Ver solo usuarios
npm run list users

# 6. Ver estadísticas completas
npm run list all
```

## Ejemplo 5: Nombres con caracteres especiales

```bash
# Nombres con acentos y caracteres latinos (válidos)
npm run create-vo name José
npm run create-vo name María
npm run create-vo name Ángel
npm run create-vo name François
npm run create-vo name "Juan Carlos"

# Listar todos los nombres
npm run list names
```

## Ejemplo 6: Dominios de email

```bash
# Crear emails de diferentes dominios
npm run create-vo email user@gmail.com
npm run create-vo email admin@outlook.com
npm run create-vo email contact@company.co.uk
npm run create-vo email support@startup.io

# Listar todos los emails (mostrará también el dominio)
npm run list emails
```

**Salida esperada:**
```
=== EMAILS ===
1. user@gmail.com (dominio: gmail.com)
2. admin@outlook.com (dominio: outlook.com)
3. contact@company.co.uk (dominio: company.co.uk)
4. support@startup.io (dominio: startup.io)
```

## Ejemplo 7: Seguridad de passwords

```bash
# Crear una password
npm run create-vo password MySecret123

# Al listar, la password se oculta por seguridad
npm run list passwords
```

**Salida esperada:**
```
=== PASSWORDS ===
1. ******** (MySecret123)
```

Nota: El valor real se muestra entre paréntesis solo para propósitos de desarrollo. En producción, nunca se debería mostrar el valor real de las passwords.

## Ejemplo 8: Persistencia de datos

```bash
# Los datos persisten entre ejecuciones
npm run create-user Jorge jorge@test.com Pass123

# Cerrar la terminal

# Abrir nueva terminal
npm run list users
# Los datos siguen ahí!

# Para limpiar todo
npm run clear
```

## Notas Importantes

1. Los datos se almacenan en `.domain-storage.json` en la raíz del proyecto
2. El archivo persiste entre ejecuciones
3. Use `npm run clear` para limpiar todos los datos
4. Todas las validaciones se aplican al crear los objetos
5. Los UUIDs de usuarios se generan automáticamente
6. Los emails se normalizan a minúsculas automáticamente

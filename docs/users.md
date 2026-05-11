# 👤 Usuarios

Esta sección documenta todos los endpoints relacionados con la gestión de usuarios.

## Crear Usuario

Registra un nuevo usuario en el sistema.

### `POST /api/users`

#### Descripción
Crea una nueva cuenta de usuario. La contraseña se valida y se almacena de forma segura usando hash.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Parámetros requeridos:**
- `email` (string): Correo electrónico único del usuario
  - Debe ser un email válido (formato: usuario@dominio.com)
- `password` (string): Contraseña del usuario
  - Se requiere al menos una contraseña no vacía

#### Response

**Status Code: 201 Created**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "createdAt": "2026-05-11T10:30:00Z",
  "updatedAt": "2026-05-11T10:30:00Z",
  "isChirpyRed": false
}
```

**Campos de respuesta:**
- `id`: Identificador único del usuario (UUID)
- `email`: Correo electrónico registrado
- `createdAt`: Fecha y hora de creación del usuario
- `updatedAt`: Última fecha y hora de actualización
- `isChirpyRed`: Indica si tiene suscripción premium (false por defecto)

#### Errores Posibles

| Código | Error | Descripción |
|--------|-------|-------------|
| 400 | BadRequestError | Email o contraseña vacíos/faltantes |
| 400 | BadRequestError | Formato de email inválido |
| 409 | ConflictError | El email ya está registrado |
| 500 | InternalServerError | Error al crear el usuario |

#### Validación

- **Email**: Debe cumplir con el formato válido de correo electrónico
- **Contraseña**: No puede estar vacía
- **Unicidad**: El email debe ser único en la base de datos

#### Ejemplo

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "miContraseña123"
  }'
```

---

## Actualizar Usuario

Actualiza la información de un usuario autenticado.

### `PUT /api/users`

#### Descripción
Actualiza el email y/o contraseña de un usuario autenticado. Requiere un access token válido.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "email": "nuevo@example.com",
  "password": "nuevaContraseña123"
}
```

**Parámetros requeridos:**
- `email` (string): Nuevo correo electrónico
  - Debe ser un email válido
- `password` (string): Nueva contraseña
  - Se requiere al menos una contraseña no vacía

#### Response

**Status Code: 200 OK**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "nuevo@example.com",
  "createdAt": "2026-05-11T10:30:00Z",
  "updatedAt": "2026-05-11T10:35:00Z",
  "isChirpyRed": false
}
```

**Campos de respuesta:**
- `id`: Identificador del usuario (sin cambios)
- `email`: Nuevo correo electrónico
- `createdAt`: Fecha original de creación
- `updatedAt`: Fecha de última actualización (actualizada)
- `isChirpyRed`: Estado de suscripción premium

#### Errores Posibles

| Código | Error | Descripción |
|--------|-------|-------------|
| 400 | BadRequestError | Email o contraseña vacíos/faltantes |
| 400 | BadRequestError | Formato de email inválido |
| 401 | UserNotAuthenticatedError | Token ausente o inválido |
| 409 | ConflictError | El nuevo email ya está registrado |
| 500 | InternalServerError | Error al actualizar el usuario |

#### Autenticación

Este endpoint requiere un **access token válido** en el header Authorization. El token debe ser un JWT válido obtenido mediante login.

#### Ejemplo

```bash
curl -X PUT http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "email": "nuevo@example.com",
    "password": "miNuevaContraseña123"
  }'
```

---

## 📋 Flujo Típico de Usuario

### 1. Crear Cuenta
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "password123"
  }'
```

### 2. Hacer Login
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "password123"
  }'
# Respuesta incluye: id, token, refreshToken, etc.
```

### 3. Actualizar Información
```bash
curl -X PUT http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_obtenido_en_login>" \
  -d '{
    "email": "maria.nueva@example.com",
    "password": "nuevoPassword456"
  }'
```

---

## 🔐 Consideraciones de Seguridad

### Contraseñas
- Las contraseñas se almacenan como hash seguro usando bcrypt
- Las contraseñas nunca se devuelven en las respuestas
- Solo puedes actualizar la contraseña de tu propia cuenta

### Tokens
- Debes estar autenticado (con un access token válido) para actualizar tu perfil
- Los tokens incluyen información codificada del usuario
- Los tokens tienen una duración limitada y pueden ser refrescados

### Emails
- Los emails deben ser únicos en el sistema
- Se valida el formato del email antes de guardar
- Solo puedes actualizar el email de tu propia cuenta

---

## 💡 Validación de Campos

### Email
- Formato: `usuario@dominio.extension`
- Debe incluir `@` y una extensión de dominio
- No puede estar vacío
- Debe ser único en la base de datos

### Contraseña
- No puede estar vacía
- Se recomienda usar contraseñas fuertes (mínimo 8 caracteres)
- Se almacena de forma segura con hash bcrypt

---

## 📝 Información del Usuario en Respuestas

Todos los endpoints de usuario devuelven la siguiente estructura:

```json
{
  "id": "uuid-del-usuario",
  "email": "usuario@example.com",
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp",
  "isChirpyRed": false
}
```

**Nota:** La contraseña y el hash de contraseña nunca se incluyen en las respuestas.

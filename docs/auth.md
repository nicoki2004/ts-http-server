# 🔐 Autenticación

Esta sección documenta todos los endpoints relacionados con la autenticación y gestión de tokens.

## Login

Autentica un usuario y devuelve access token y refresh token.

### `POST /api/login`

#### Descripción
Valida las credenciales del usuario y genera un access token (JWT) y un refresh token para futuras solicitudes autenticadas.

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
- `email` (string): Correo electrónico del usuario
- `password` (string): Contraseña del usuario

#### Response

**Status Code: 200 OK**

```json
{
  "id": "uuid-del-usuario",
  "email": "usuario@example.com",
  "createdAt": "2026-05-11T10:30:00Z",
  "updatedAt": "2026-05-11T10:30:00Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh-token-string",
  "isChirpyRed": false
}
```

**Campos de respuesta:**
- `id`: Identificador único del usuario
- `email`: Correo electrónico del usuario
- `createdAt`: Fecha de creación del usuario
- `updatedAt`: Última actualización del usuario
- `token`: Access token JWT (válido por corto tiempo)
- `refreshToken`: Refresh token (válido por más tiempo)
- `isChirpyRed`: Indica si el usuario tiene suscripción premium

#### Errores Posibles

| Código | Error | Descripción |
|--------|-------|-------------|
| 400 | BadRequestError | Email o contraseña vacíos |
| 401 | UserNotAuthenticatedError | Email o contraseña incorrectos |

#### Ejemplo

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

---

## Refrescar Token

Obtiene un nuevo access token usando un refresh token válido.

### `POST /api/refresh`

#### Descripción
Genera un nuevo access token a partir de un refresh token válido. Útil cuando el access token ha expirado.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <refresh_token>
```

**Body:** Vacío

#### Response

**Status Code: 200 OK**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Campos de respuesta:**
- `token`: Nuevo access token JWT

#### Errores Posibles

| Código | Error | Descripción |
|--------|-------|-------------|
| 401 | UserNotAuthenticatedError | Refresh token inválido o revocado |
| 400 | BadRequestError | Refresh token no proporcionado |

#### Ejemplo

```bash
curl -X POST http://localhost:8080/api/refresh \
  -H "Authorization: Bearer <tu_refresh_token>"
```

---

## Revocar Token

Invalida un refresh token, impidiendo su uso futuro.

### `POST /api/revoke`

#### Descripción
Revoca un refresh token, lo que impide que se use para generar nuevos access tokens. Es útil para implementar logout.

#### Request

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Body:** Vacío

#### Response

**Status Code: 200 OK**

```json
{}
```

#### Errores Posibles

| Código | Error | Descripción |
|--------|-------|-------------|
| 401 | UserNotAuthenticatedError | Token de actualización inválido |
| 400 | BadRequestError | Token no proporcionado |

#### Ejemplo

```bash
curl -X POST http://localhost:8080/api/revoke \
  -H "Authorization: Bearer <tu_refresh_token>"
```

---

## 💡 Flujo Completo de Autenticación

### 1. Usuario nuevo
```bash
# 1. Registrarse
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@example.com",
    "password": "password123"
  }'

# Respuesta:
# {
#   "id": "user-123",
#   "email": "nuevo@example.com",
#   "createdAt": "2026-05-11T10:30:00Z",
#   "updatedAt": "2026-05-11T10:30:00Z",
#   "isChirpyRed": false
# }
```

### 2. Login
```bash
# 2. Iniciar sesión
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@example.com",
    "password": "password123"
  }'

# Respuesta:
# {
#   "id": "user-123",
#   "email": "nuevo@example.com",
#   "token": "access-token-jwt",
#   "refreshToken": "refresh-token-string",
#   ...
# }
```

### 3. Usar el token
```bash
# 3. Usar el access token para solicitudes autenticadas
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer access-token-jwt" \
  -d '{
    "body": "¡Mi primer chirp!"
  }'
```

### 4. Refrescar cuando expire
```bash
# 4. Cuando el access token expire, usar refresh token
curl -X POST http://localhost:8080/api/refresh \
  -H "Authorization: Bearer refresh-token-string"

# Respuesta:
# {
#   "token": "nuevo-access-token-jwt"
# }
```

### 5. Logout
```bash
# 5. Logout - revocar refresh token
curl -X POST http://localhost:8080/api/revoke \
  -H "Authorization: Bearer refresh-token-string"
```

---

## 🔑 Cómo Usar Tokens

### En el Header Authorization
Todos los endpoints que requieren autenticación esperan el token en el header `Authorization` con el formato:

```
Authorization: Bearer <token_aqui>
```

### Ejemplo completo
```bash
curl -X PUT http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "email": "nuevo@example.com",
    "password": "nueva_password"
  }'
```

---

## ⏱️ Tiempos de Expiración

- **Access Token**: Duración corta (típicamente 1 hora)
- **Refresh Token**: Duración larga (válido hasta que se revoque o expire)

Siempre verifica que el token sea válido antes de hacer solicitudes autenticadas.

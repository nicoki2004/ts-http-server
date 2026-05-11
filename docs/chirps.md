# 🐦 Chirps

Esta sección documenta todos los endpoints relacionados con chirps (publicaciones cortas).

## Crear Chirp

Publica un nuevo chirp (mensaje corto).

### `POST /api/chirps`

#### Descripción
Crea un nuevo chirp para el usuario autenticado. Los chirps pueden contener un máximo de 140 caracteres y las palabras prohibidas se reemplazan automáticamente.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "body": "¡Hola Chirpy! Este es mi primer chirp"
}
```

**Parámetros requeridos:**
- `body` (string): Contenido del chirp
  - Máximo 140 caracteres
  - No puede estar vacío
  - Las palabras prohibidas se reemplazan con `****`

#### Response

**Status Code: 201 Created**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "body": "¡Hola Chirpy! Este es mi primer chirp",
  "userId": "user-123",
  "createdAt": "2026-05-11T10:30:00Z"
}
```

**Campos de respuesta:**
- `id`: Identificador único del chirp (UUID)
- `body`: Contenido del chirp (con palabras prohibidas filtradas)
- `userId`: ID del usuario que creó el chirp
- `createdAt`: Fecha y hora de creación

#### Errores Posibles

| Código | Error | Descripción |
|--------|-------|-------------|
| 400 | BadRequestError | Body vacío o faltante |
| 400 | BadRequestError | Chirp excede 140 caracteres |
| 401 | UserNotAuthenticatedError | Token ausente o inválido |
| 500 | InternalServerError | Error al crear el chirp |

#### Autenticación

Este endpoint requiere un **access token válido** en el header Authorization.

#### Palabras Prohibidas

Las siguientes palabras se reemplazan automáticamente:
- `kerfuffle` → `****`
- `sharbert` → `****`
- `fornax` → `****`

#### Ejemplo

```bash
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "body": "¡Mi primer chirp!"
  }'
```

---

## Obtener Chirps

Obtiene una lista de chirps con opciones de filtrado.

### `GET /api/chirps`

#### Descripción
Obtiene todos los chirps del sistema o filtra por autor. No requiere autenticación.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Query Parameters (Opcionales):**
- `authorId` (string): ID del usuario autor para filtrar chirps
  - Si no se proporciona, devuelve todos los chirps

#### Response

**Status Code: 200 OK**

```json
[
  {
    "id": "chirp-123",
    "body": "¡Hola Chirpy!",
    "userId": "user-456",
    "createdAt": "2026-05-11T10:30:00Z"
  },
  {
    "id": "chirp-124",
    "body": "Mi segundo chirp",
    "userId": "user-456",
    "createdAt": "2026-05-11T10:35:00Z"
  }
]
```

#### Ejemplos

**Obtener todos los chirps:**
```bash
curl -X GET http://localhost:8080/api/chirps
```

**Obtener chirps de un usuario específico:**
```bash
curl -X GET "http://localhost:8080/api/chirps?authorId=user-123"
```

---

## Obtener Chirp por ID

Obtiene un chirp específico por su ID.

### `GET /api/chirps/:chirpId`

#### Descripción
Obtiene los detalles de un chirp específico por su identificador único.

#### Request

**Path Parameters:**
- `chirpId` (string): ID único del chirp

#### Response

**Status Code: 200 OK**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "body": "¡Hola Chirpy!",
  "userId": "user-123",
  "createdAt": "2026-05-11T10:30:00Z"
}
```

#### Errores Posibles

| Código | Error | Descripción |
|--------|-------|-------------|
| 400 | BadRequestError | ID del chirp inválido o faltante |
| 404 | NotFoundError | Chirp no encontrado |

#### Ejemplo

```bash
curl -X GET http://localhost:8080/api/chirps/550e8400-e29b-41d4-a716-446655440000
```

---

## Eliminar Chirp

Elimina un chirp específico.

### `DELETE /api/chirps/:chirpId`

#### Descripción
Elimina un chirp. Solo el usuario que creó el chirp puede eliminarlo.

#### Request

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `chirpId` (string): ID único del chirp a eliminar

#### Response

**Status Code: 204 No Content**

Sin contenido en la respuesta.

#### Errores Posibles

| Código | Error | Descripción |
|--------|-------|-------------|
| 400 | BadRequestError | ID del chirp inválido o faltante |
| 401 | UserNotAuthenticatedError | Token ausente o inválido |
| 403 | ForbiddenRequestError | No eres el propietario del chirp |
| 404 | NotFoundError | Chirp no encontrado |

#### Autenticación

Este endpoint requiere un **access token válido** en el header Authorization. Solo puedes eliminar tus propios chirps.

#### Ejemplo

```bash
curl -X DELETE http://localhost:8080/api/chirps/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📋 Flujo Típico con Chirps

### 1. Crear un Chirp
```bash
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "body": "¡Chirpy es genial!"
  }'
```

### 2. Obtener Todos los Chirps
```bash
curl -X GET http://localhost:8080/api/chirps
```

### 3. Obtener Chirps de un Usuario
```bash
curl -X GET "http://localhost:8080/api/chirps?authorId=user-123"
```

### 4. Obtener un Chirp Específico
```bash
curl -X GET http://localhost:8080/api/chirps/chirp-id
```

### 5. Eliminar tu Chirp
```bash
curl -X DELETE http://localhost:8080/api/chirps/chirp-id \
  -H "Authorization: Bearer <tu_token>"
```

---

## 🔐 Reglas y Limitaciones

### Límite de Caracteres
- Máximo: **140 caracteres**
- Si envías un chirp más largo, recibirás un error 400

### Palabras Prohibidas
Estas palabras se filtran automáticamente:
- `kerfuffle`
- `sharbert`
- `fornax`

Se reemplazan por `****` en el chirp guardado.

### Propiedad y Eliminación
- Solo el creador de un chirp puede eliminarlo
- Los administradores del sistema pueden ver todos los chirps
- Los chirps pueden ser consultados por cualquier usuario

### Autenticación
- **Crear chirp**: Requiere autenticación
- **Obtener chirps**: No requiere autenticación
- **Eliminar chirp**: Requiere autenticación (solo el propietario)

---

## 📊 Estructura del Chirp

Todos los chirps tienen la siguiente estructura:

```json
{
  "id": "string (UUID)",
  "body": "string (máximo 140 caracteres)",
  "userId": "string (UUID del autor)",
  "createdAt": "ISO-8601 timestamp"
}
```

---

## 💡 Ejemplos Útiles

### Validación automática
```bash
# ❌ Esto falla - muy largo (141 caracteres)
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "body": "Este es un chirp muy largo que excede el límite de ciento cuarenta caracteres que tenemos establecidos en nuestro sistema"
  }'
# Respuesta: 400 Bad Request - Chirp is too long. Max length is 140

# ✅ Esto funciona
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "body": "Este es un chirp válido que cumple con el límite de 140 caracteres"
  }'
```

### Filtrado de palabras
```bash
# Input: "kerfuffle"
# Output: "****"

curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "body": "Esto es kerfuffle"
  }'
# Respuesta: {"body": "Esto es ****", ...}
```

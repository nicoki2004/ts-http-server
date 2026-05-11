# 🐦 Chirpy API Documentation

¡Bienvenido a la documentación de **Chirpy**! Esta es una API moderna para gestionar usuarios y publicar mensajes cortos (chirps).

## 📚 Tabla de Contenidos

- [Introducción Rápida](#introducción-rápida)
- [Autenticación](#autenticación)
- [Endpoints](#endpoints)
- [Códigos de Estado](#códigos-de-estado)
- [Errores](#errores)

## 🚀 Introducción Rápida

### URL Base
```
http://localhost:8080
```

### Ambiente de Desarrollo
Para comenzar a usar la API en desarrollo:

1. Crear un nuevo usuario
2. Hacer login para obtener un token
3. Usar el token en las solicitudes autenticadas

## 🔐 Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT (JSON Web Tokens).

### Flujo de Autenticación

1. **Registro**: `POST /api/users` - Crea un nuevo usuario
2. **Login**: `POST /api/login` - Obtiene access token y refresh token
3. **Usar Token**: Incluye el token en el header `Authorization: Bearer <token>`
4. **Refrescar**: `POST /api/refresh` - Obtiene un nuevo access token
5. **Revocar**: `POST /api/revoke` - Invalida el refresh token

Para más detalles, consulta [Autenticación](./auth.md)

## 📋 Endpoints

### 👤 Usuarios
- [Crear Usuario](./users.md#crear-usuario) - `POST /api/users`
- [Actualizar Usuario](./users.md#actualizar-usuario) - `PUT /api/users`

### 🐦 Chirps
- [Crear Chirp](./chirps.md#crear-chirp) - `POST /api/chirps`
- [Obtener Chirps](./chirps.md#obtener-chirps) - `GET /api/chirps`
- [Obtener Chirp por ID](./chirps.md#obtener-chirp-por-id) - `GET /api/chirps/:chirpId`
- [Eliminar Chirp](./chirps.md#eliminar-chirp) - `DELETE /api/chirps/:chirpId`

### 🔑 Autenticación
- [Login](./auth.md#login) - `POST /api/login`
- [Refrescar Token](./auth.md#refrescar-token) - `POST /api/refresh`
- [Revocar Token](./auth.md#revocar-token) - `POST /api/revoke`

### ⚙️ Admin
- [Obtener Métricas](./admin.md#obtener-métricas) - `GET /admin/metrics`
- [Reset](./admin.md#reset) - `POST /admin/reset`

### 🔗 Webhooks
- [Polka Webhook](./webhooks.md) - `POST /api/polka/webhooks`

### 💚 Health Check
- [Readiness](./health.md) - `GET /api/healthz`

## 📊 Códigos de Estado

| Código | Descripción |
|--------|-------------|
| **200** | OK - La solicitud fue exitosa |
| **201** | Created - El recurso fue creado exitosamente |
| **204** | No Content - Solicitud exitosa sin contenido en respuesta |
| **400** | Bad Request - Solicitud inválida o parámetros faltantes |
| **401** | Unauthorized - Token inválido o ausente |
| **403** | Forbidden - No tienes permisos para acceder a este recurso |
| **404** | Not Found - El recurso no fue encontrado |
| **500** | Internal Server Error - Error en el servidor |

## ❌ Errores

Todos los errores se devuelven en formato JSON con la siguiente estructura:

```json
{
  "error": "Descripción del error"
}
```

### Tipos de Error

- **BadRequestError**: Solicitud inválida o parámetros faltantes (400)
- **UserNotAuthenticatedError**: Token inválido o ausente (401)
- **ForbiddenRequestError**: No tienes permisos (403)
- **NotFoundError**: Recurso no encontrado (404)
- **UnauthorizedRequestError**: API Key inválida (401)

## 💡 Ejemplos de Uso

### Crear un Usuario
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

### Hacer Login
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

### Crear un Chirp
```bash
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token_aqui>" \
  -d '{
    "body": "¡Hola Chirpy!"
  }'
```

## 📝 Notas Importantes

- Los tokens de acceso tienen una duración limitada
- Los refresh tokens se pueden usar para obtener nuevos access tokens
- Los chirps tienen un límite máximo de 140 caracteres
- Las palabras prohibidas se reemplazan automáticamente con `****`
- Solo puedes eliminar chirps que creaste

---

Para más información sobre cada endpoint, consulta los archivos de documentación específicos en la carpeta `docs/`.

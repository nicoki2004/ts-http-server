# 📖 Referencia Rápida de Endpoints

Una guía rápida y visual de todos los endpoints disponibles en la API Chirpy.

---

## 🐦 CHIRPS

### POST /api/chirps
**Crear un chirp**
- 🔐 Requiere: `Authorization: Bearer <token>`
- 📦 Body: `{ "body": "texto" }` (máx 140 caracteres)
- ✅ Response: `201 Created`
- 📄 Docs: [Crear Chirp](./chirps.md#crear-chirp)

```bash
curl -X POST http://localhost:8080/api/chirps \
  -H "Authorization: Bearer <token>" \
  -d '{"body":"¡Hola!"}'
```

---

### GET /api/chirps
**Obtener todos los chirps**
- 🔐 Requiere: No
- 📋 Query: `?authorId=user-id` (opcional)
- ✅ Response: `200 OK` - Array de chirps
- 📄 Docs: [Obtener Chirps](./chirps.md#obtener-chirps)

```bash
curl -X GET http://localhost:8080/api/chirps
curl -X GET "http://localhost:8080/api/chirps?authorId=user-123"
```

---

### GET /api/chirps/:chirpId
**Obtener un chirp específico**
- 🔐 Requiere: No
- ✅ Response: `200 OK` - Un chirp
- 📄 Docs: [Obtener Chirp por ID](./chirps.md#obtener-chirp-por-id)

```bash
curl -X GET http://localhost:8080/api/chirps/chirp-123
```

---

### DELETE /api/chirps/:chirpId
**Eliminar un chirp**
- 🔐 Requiere: `Authorization: Bearer <token>`
- 👤 Solo el propietario puede eliminar
- ✅ Response: `204 No Content`
- 📄 Docs: [Eliminar Chirp](./chirps.md#eliminar-chirp)

```bash
curl -X DELETE http://localhost:8080/api/chirps/chirp-123 \
  -H "Authorization: Bearer <token>"
```

---

## 👤 USUARIOS

### POST /api/users
**Crear un usuario (Registrarse)**
- 🔐 Requiere: No
- 📦 Body: `{ "email": "user@example.com", "password": "pass" }`
- ✅ Response: `201 Created` - Usuario creado
- 📄 Docs: [Crear Usuario](./users.md#crear-usuario)

```bash
curl -X POST http://localhost:8080/api/users \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

### PUT /api/users
**Actualizar un usuario**
- 🔐 Requiere: `Authorization: Bearer <token>`
- 📦 Body: `{ "email": "nuevo@example.com", "password": "pass" }`
- ✅ Response: `200 OK` - Usuario actualizado
- 📄 Docs: [Actualizar Usuario](./users.md#actualizar-usuario)

```bash
curl -X PUT http://localhost:8080/api/users \
  -H "Authorization: Bearer <token>" \
  -d '{"email":"nuevo@example.com","password":"newpass"}'
```

---

## 🔐 AUTENTICACIÓN

### POST /api/login
**Iniciar sesión**
- 🔐 Requiere: No
- 📦 Body: `{ "email": "user@example.com", "password": "pass" }`
- ✅ Response: `200 OK` - Token y refresh token
- 📄 Docs: [Login](./auth.md#login)

```bash
curl -X POST http://localhost:8080/api/login \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

### POST /api/refresh
**Obtener nuevo access token**
- 🔐 Requiere: `Authorization: Bearer <refresh_token>`
- ✅ Response: `200 OK` - Nuevo token
- 📄 Docs: [Refrescar Token](./auth.md#refrescar-token)

```bash
curl -X POST http://localhost:8080/api/refresh \
  -H "Authorization: Bearer <refresh_token>"
```

---

### POST /api/revoke
**Logout - Revocar refresh token**
- 🔐 Requiere: `Authorization: Bearer <refresh_token>`
- ✅ Response: `200 OK`
- 📄 Docs: [Revocar Token](./auth.md#revocar-token)

```bash
curl -X POST http://localhost:8080/api/revoke \
  -H "Authorization: Bearer <refresh_token>"
```

---

## ⚙️ ADMINISTRACIÓN

### GET /admin/metrics
**Ver métricas del servidor**
- 🔐 Requiere: No
- 📊 Retorna: Página HTML con contador de visitas
- 📄 Docs: [Obtener Métricas](./admin.md#obtener-métricas)

```bash
curl -X GET http://localhost:8080/admin/metrics
```

---

### POST /admin/reset
**Reiniciar métricas**
- 🔐 Requiere: No
- ✅ Response: `200 OK`
- 📄 Docs: [Reset](./admin.md#reset)

```bash
curl -X POST http://localhost:8080/admin/reset
```

---

## 🔗 WEBHOOKS

### POST /api/polka/webhooks
**Webhook de Polka**
- 🔐 Requiere: `Authorization: ApiKey <api_key>`
- 📦 Body: `{ "event": "user.upgraded", "data": { "userId": "id" } }`
- ✅ Response: `204 No Content`
- 📄 Docs: [Polka Webhook](./webhooks.md)

```bash
curl -X POST http://localhost:8080/api/polka/webhooks \
  -H "Authorization: ApiKey <api_key>" \
  -d '{"event":"user.upgraded","data":{"userId":"user-id"}}'
```

---

## 💚 HEALTH CHECK

### GET /api/healthz
**Health check del servidor**
- 🔐 Requiere: No
- ✅ Response: `200 OK` - Servidor operativo
- 📄 Docs: [Health Check](./health.md)

```bash
curl -X GET http://localhost:8080/api/healthz
```

---

## 📊 Tabla de Resumen

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/chirps` | ✅ | Crear chirp |
| GET | `/api/chirps` | ❌ | Obtener chirps |
| GET | `/api/chirps/:chirpId` | ❌ | Obtener chirp |
| DELETE | `/api/chirps/:chirpId` | ✅ | Eliminar chirp |
| POST | `/api/users` | ❌ | Crear usuario |
| PUT | `/api/users` | ✅ | Actualizar usuario |
| POST | `/api/login` | ❌ | Login |
| POST | `/api/refresh` | ✅ | Refrescar token |
| POST | `/api/revoke` | ✅ | Logout |
| GET | `/admin/metrics` | ❌ | Ver métricas |
| POST | `/admin/reset` | ❌ | Reiniciar métricas |
| POST | `/api/polka/webhooks` | ✅ | Webhook Polka |
| GET | `/api/healthz` | ❌ | Health check |

---

## 🔑 Leyenda

- **✅ Auth**: Requiere autenticación (Authorization header)
- **❌ Auth**: No requiere autenticación
- **🔐**: Seguro - sensible a credenciales
- **📦**: Parámetros en el body
- **📋**: Parámetros en query string
- **✅ Response**: Código de estado esperado

---

## 💡 Ejemplos de Flujo Completo

### Registro → Login → Crear Chirp

```bash
# 1️⃣ Registrarse
USER=$(curl -X POST http://localhost:8080/api/users \
  -d '{"email":"user@example.com","password":"pass"}' 2>/dev/null)

# 2️⃣ Login
LOGIN=$(curl -X POST http://localhost:8080/api/login \
  -d '{"email":"user@example.com","password":"pass"}' 2>/dev/null)

TOKEN=$(echo $LOGIN | jq -r '.token')

# 3️⃣ Crear chirp
curl -X POST http://localhost:8080/api/chirps \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"body":"¡Mi primer chirp!"}'
```

---

## 🚨 Códigos de Estado Comunes

| Código | Significado |
|--------|-------------|
| 200 | ✅ OK - Solicitud exitosa |
| 201 | ✅ Created - Recurso creado |
| 204 | ✅ No Content - Éxito sin contenido |
| 400 | ❌ Bad Request - Datos inválidos |
| 401 | ❌ Unauthorized - Token inválido/falta |
| 403 | ❌ Forbidden - No tienes permiso |
| 404 | ❌ Not Found - Recurso no existe |
| 500 | ❌ Server Error - Error interno |

---

## 📚 Documentación Completa

Para detalles completos de cada endpoint, consulta:

- [🐦 Chirps](./chirps.md)
- [👤 Usuarios](./users.md)
- [🔐 Autenticación](./auth.md)
- [⚙️ Administración](./admin.md)
- [🔗 Webhooks](./webhooks.md)
- [💚 Health Check](./health.md)


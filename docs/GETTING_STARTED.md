# 🚀 Guía de Inicio Rápido

Comienza a usar la API Chirpy en 5 minutos.

---

## 1️⃣ Crear una Cuenta

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mi_email@example.com",
    "password": "mi_contraseña"
  }'
```

**Respuesta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "mi_email@example.com",
  "createdAt": "2026-05-11T10:30:00Z",
  "updatedAt": "2026-05-11T10:30:00Z",
  "isChirpyRed": false
}
```

---

## 2️⃣ Iniciar Sesión

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mi_email@example.com",
    "password": "mi_contraseña"
  }'
```

**Respuesta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "mi_email@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh-token-value",
  "isChirpyRed": false
}
```

💾 **Guarda tu `token` - lo necesitarás para los próximos pasos**

---

## 3️⃣ Publicar tu Primer Chirp

```bash
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "body": "¡Hola Chirpy! 🐦"
  }'
```

**Respuesta:**
```json
{
  "id": "chirp-123",
  "body": "¡Hola Chirpy! 🐦",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-05-11T10:35:00Z"
}
```

---

## 4️⃣ Ver Todos los Chirps

```bash
curl -X GET http://localhost:8080/api/chirps
```

**Respuesta:**
```json
[
  {
    "id": "chirp-123",
    "body": "¡Hola Chirpy! 🐦",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-05-11T10:35:00Z"
  },
  {
    "id": "chirp-124",
    "body": "Mi segundo chirp",
    "userId": "otro-usuario-id",
    "createdAt": "2026-05-11T10:40:00Z"
  }
]
```

---

## 5️⃣ Ver Chirps de un Usuario Específico

```bash
curl -X GET "http://localhost:8080/api/chirps?authorId=550e8400-e29b-41d4-a716-446655440000"
```

---

## 🎯 Casos de Uso Comunes

### Crear varias cuentas de prueba

```bash
# Usuario 1
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario1@example.com", "password": "pass123"}'

# Usuario 2
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario2@example.com", "password": "pass123"}'
```

### Actualizar tu perfil

```bash
curl -X PUT http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "email": "nuevo_email@example.com",
    "password": "nueva_contraseña"
  }'
```

### Eliminar uno de tus chirps

```bash
curl -X DELETE http://localhost:8080/api/chirps/chirp-123 \
  -H "Authorization: Bearer <tu_token>"
```

### Ver métricas del servidor

```bash
curl -X GET http://localhost:8080/admin/metrics
```

### Verificar que el servidor está activo

```bash
curl -X GET http://localhost:8080/api/healthz
```

---

## ⏰ Gestionar Tokens

### Mi token expiró, ¿qué hago?

```bash
curl -X POST http://localhost:8080/api/refresh \
  -H "Authorization: Bearer <tu_refresh_token>"
```

Esto devuelve un nuevo `token` que puedes usar inmediatamente.

### ¿Cómo hago logout?

```bash
curl -X POST http://localhost:8080/api/revoke \
  -H "Authorization: Bearer <tu_refresh_token>"
```

Esto invalida tu refresh token. Tendrás que hacer login nuevamente.

---

## 🐛 Solucionar Problemas

### Error 401 - Unauthorized

```json
{
  "error": "Invalid Token"
}
```

**Causas posibles:**
- Token ausente en el header `Authorization`
- Token expirado
- Token inválido

**Solución:**
- Asegúrate de incluir el header: `Authorization: Bearer <tu_token>`
- Si el token expiró, usa el `refreshToken` para obtener uno nuevo
- Si no tienes un `refreshToken`, vuelve a hacer login

### Error 400 - Bad Request

```json
{
  "error": "Missing required fields"
}
```

**Causas posibles:**
- Falta un parámetro requerido
- El formato de datos es incorrecto

**Solución:**
- Verifica que incluiste todos los campos requeridos
- Revisa que el JSON esté bien formado

### Error 404 - Not Found

```json
{
  "error": "Chirp with chirpId: xyz not found"
}
```

**Causas posibles:**
- El ID del recurso no existe
- Escribiste mal el ID

**Solución:**
- Verifica que el ID sea correcto
- Asegúrate de que el recurso existe antes de intentar acceder a él

### Error 403 - Forbidden

```json
{
  "error": "You don't have permission to delete this chirp"
}
```

**Causas posibles:**
- Intentas eliminar un chirp que no creaste
- No tienes permisos suficientes

**Solución:**
- Solo puedes eliminar tus propios chirps
- Verifica que estés usando tu token correcto

---

## 📝 Límites y Restricciones

- **Chirps**: Máximo 140 caracteres
- **Email**: Debe ser un email válido y único
- **Contraseña**: No puede estar vacía
- **Palabras prohibidas**: `kerfuffle`, `sharbert`, `fornax` se reemplazan con `****`

---

## 🔗 Próximos Pasos

- Lee la [Referencia Rápida](./QUICK_REFERENCE.md) para una visión general
- Consulta la [Documentación de Chirps](./chirps.md) para más detalles
- Revisa la [Documentación de Autenticación](./auth.md) para entender los tokens
- Lee sobre [Webhooks](./webhooks.md) si integras con Polka

---

## 💡 Tips

1. **Guarda tus tokens**: Necesitarás el `token` para operaciones autenticadas
2. **Usa refresh tokens**: Cuando tu token expire, usa el `refreshToken` para obtener uno nuevo
3. **Lee los errores**: Los mensajes de error son descriptivos
4. **Valida datos**: Asegúrate de que los datos sean válidos antes de enviar
5. **Prueba en localhost**: Primero prueba todo localmente antes de ir a producción

---

¡Felicidades! Ya estás listo para usar la API Chirpy. 🎉

Para más información, consulta la documentación completa en [README.md](./README.md).

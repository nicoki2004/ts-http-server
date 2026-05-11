# 🔗 Webhooks

Esta sección documenta los webhooks disponibles en la API.

## Polka Webhook

Procesa eventos de Polka para actualizar usuarios.

### `POST /api/polka/webhooks`

#### Descripción
Webhook que recibe eventos de Polka para actualizar el estado de suscripción de usuarios. Cuando un usuario se actualiza a Chirpy Red (premium), este endpoint marca su cuenta como suscriptor premium.

#### Request

**Headers:**
```
Content-Type: application/json
Authorization: ApiKey <api_key>
```

**Body:**
```json
{
  "event": "user.upgraded",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Parámetros requeridos:**
- `event` (string): Tipo de evento
  - Soportado: `"user.upgraded"`
- `data` (object): Datos del evento
  - `userId` (string): ID del usuario a actualizar

**Headers requeridos:**
- `Authorization`: Debe ser `ApiKey <api_key>` donde `<api_key>` es la clave secreta configurada

#### Response

**Status Code: 204 No Content**

Sin contenido en la respuesta.

#### Errores Posibles

| Código | Error | Descripción |
|--------|-------|-------------|
| 400 | BadRequestError | Parámetros mal formados |
| 401 | UnauthorizedRequestError | API Key inválida o ausente |
| 404 | NotFoundError | Usuario no encontrado |
| 500 | InternalServerError | Error al procesar el webhook |

#### Autenticación

Este endpoint requiere una **API Key válida** en el header Authorization con el formato:
```
Authorization: ApiKey tu-clave-secreta-aqui
```

#### Estructura de Eventos

Actualmente se soporta un tipo de evento:

##### user.upgraded
Se dispara cuando un usuario se actualiza a un plan premium (Chirpy Red).

```json
{
  "event": "user.upgraded",
  "data": {
    "userId": "usuario-id-uuid"
  }
}
```

**Efectos:**
- Marca el usuario con `isChirpyRed: true`
- Actualiza el timestamp `updatedAt`

#### Ejemplo

```bash
curl -X POST http://localhost:8080/api/polka/webhooks \
  -H "Content-Type: application/json" \
  -H "Authorization: ApiKey tu-clave-api-secreta" \
  -d '{
    "event": "user.upgraded",
    "data": {
      "userId": "550e8400-e29b-41d4-a716-446655440000"
    }
  }'
```

---

## 🔐 Seguridad de Webhooks

### API Key
- Se requiere una API Key válida en cada solicitud
- La clave debe estar configurada en las variables de entorno
- Se recomienda rotar las claves periódicamente

### Validación
- La solicitud debe incluir el header `Authorization: ApiKey <key>`
- Si la clave es inválida, se retorna 401
- Los parámetros deben estar correctamente formados

### IP Whitelisting
- Se recomienda configurar el firewall para solo aceptar solicitudes de los servidores de Polka
- Valida que las solicitudes provengan de fuentes confiables

---

## 📋 Flujo de Suscripción Premium

### 1. Usuario se suscribe a Chirpy Red
El usuario compra una suscripción premium en Polka.

### 2. Polka envía webhook
Polka notifica al servidor con un evento `user.upgraded`:
```json
{
  "event": "user.upgraded",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 3. Sistema actualiza usuario
El servidor marca al usuario con `isChirpyRed: true`

### 4. Verificación
Al hacer login o obtener datos del usuario, `isChirpyRed` será `true`

---

## 🔄 Manejo de Webhooks en Cliente

### Reintentos
Polka típicamente reintenta enviar webhooks si recibe un error:
- Primer intento: inmediato
- Reintentos: con backoff exponencial

**Recomendaciones:**
- Asegúrate de procesar el webhook correctamente
- Devuelve 204 No Content solo si el procesamiento fue exitoso
- Implementa idempotencia (procesar el mismo webhook dos veces debe ser seguro)

### Idempotencia
```bash
# Primer envío
POST /api/polka/webhooks con userId: user-123

# Reintento (mismo webhook)
POST /api/polka/webhooks con userId: user-123

# Resultado: ambos deberían resultar en el mismo estado
# (usuario marcado como isChirpyRed: true)
```

---

## 📊 Eventos Soportados

| Evento | Descripción | Acción |
|--------|-------------|--------|
| `user.upgraded` | Usuario se suscribe a Chirpy Red | Marcar `isChirpyRed: true` |

### Eventos Futuros

Se pueden agregar más eventos en el futuro:
- `user.downgraded` - Usuario cancela suscripción
- `payment.failed` - Fallo en pago
- `subscription.expired` - Suscripción expirada

---

## 💡 Ejemplos de Integración

### Procesar webhook en Node.js/Express
```javascript
app.post('/api/polka/webhooks', async (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'user.upgraded') {
    // Actualizar usuario en BD
    await User.update(data.userId, { isChirpyRed: true });
    
    // Retornar 204
    res.status(204).send();
  }
});
```

### Configurar API Key en producción
```bash
# Archivo .env
POLKA_API_KEY=tu-clave-secreta-muy-larga-y-compleja
```

### Validar el webhook
```bash
# Verificar que la API Key es correcta
curl -X POST http://localhost:8080/api/polka/webhooks \
  -H "Content-Type: application/json" \
  -H "Authorization: ApiKey clave-incorrecta" \
  -d '{
    "event": "user.upgraded",
    "data": { "userId": "test" }
  }'
# Respuesta: 401 Unauthorized - Invalid API Key
```

---

## 🔗 Referencias

- [Integración con Polka](../README.md)
- [Endpoints de Usuarios](./users.md)
- [Autenticación](./auth.md)


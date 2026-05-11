# ⚙️ Endpoints de Administración

Esta sección documenta los endpoints administrativos del sistema.

## Obtener Métricas

Obtiene estadísticas del servidor.

### `GET /admin/metrics`

#### Descripción
Retorna una página HTML con métricas de uso del servidor, incluyendo el número de visitas al servidor de archivos.

#### Request

**Headers:**
```
Content-Type: application/json
```

#### Response

**Status Code: 200 OK**

```html
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited 42 times!</p>
  </body>
</html>
```

**Contenido:**
- Página HTML con título de bienvenida
- Contador de visitas al servidor de archivos `/app`

#### Notas

- Este endpoint retorna HTML, no JSON
- Las visitas se cuentan cada vez que se accede a recursos bajo `/app`
- El contador se reinicia cuando se ejecuta el endpoint `/admin/reset`

#### Ejemplo

```bash
curl -X GET http://localhost:8080/admin/metrics
```

---

## Reset

Reinicia el contador de métricas del servidor.

### `POST /admin/reset`

#### Descripción
Reinicia el contador de visitas del servidor de archivos a cero. Útil para comenzar a contar desde un punto específico.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:** Vacío

#### Response

**Status Code: 200 OK**

```json
{}
```

Respuesta vacía.

#### Notas

- Este endpoint reinicia todas las métricas
- Después de ejecutar esto, el contador de visitas vuelve a cero
- El reset es inmediato y afecta solo las métricas en memoria

#### Ejemplo

```bash
curl -X POST http://localhost:8080/admin/reset
```

---

## 📊 Sistema de Métricas

### ¿Qué se cuenta?

Se incrementa el contador cada vez que:
- Un usuario accede a un archivo bajo `/app` (aplicación web estática)
- Se sirve el archivo `index.html`
- Se sirven archivos de assets (CSS, JS, imágenes, etc.)

### ¿Qué no se cuenta?

- Solicitudes a endpoints de API (`/api/...`)
- Solicitudes a otros endpoints (`/admin/...` excepto aquí mencionados)
- Solicitudes fallidas (404, etc.)

---

## 💡 Casos de Uso

### Monitorear el uso de la aplicación
```bash
# 1. Obtener métricas actuales
curl -X GET http://localhost:8080/admin/metrics

# 2. Esperar un tiempo
sleep 60

# 3. Obtener métricas nuevamente para ver el incremento
curl -X GET http://localhost:8080/admin/metrics
```

### Reiniciar métricas para pruebas
```bash
# 1. Reiniciar el contador
curl -X POST http://localhost:8080/admin/reset

# 2. Verificar que el contador está en cero
curl -X GET http://localhost:8080/admin/metrics
# Respuesta mostrará: Chirpy has been visited 0 times!

# 3. Acceder a la aplicación web
# (esto incrementará el contador)

# 4. Verificar nuevamente
curl -X GET http://localhost:8080/admin/metrics
```

---

## 🔐 Consideraciones de Seguridad

### Acceso
- Estos endpoints no requieren autenticación actualmente
- En producción, se recomienda protegerlos con:
  - API keys
  - Token JWT con rol de administrador
  - Restricción de IP

### Información Sensible
- Las métricas revelan información sobre el uso del servidor
- En producción, considera si esta información debe ser pública

---

## 📝 Notas Técnicas

### Almacenamiento de Métricas
- Las métricas se almacenan en memoria (RAM)
- Se pierden cuando el servidor se reinicia
- Para persistencia, considera guardar en base de datos

### Contador de Visitas
- Es un número entero que se incrementa con cada acceso a `/app`
- Se reinicia a 0 con el endpoint `/admin/reset`
- No hay límite máximo (puede crecer indefinidamente)

---

## 📋 Resumen de Endpoints Admin

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/admin/metrics` | Obtener página de métricas |
| `POST` | `/admin/reset` | Reiniciar contador de visitas |


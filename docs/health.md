# 💚 Health Check

Esta sección documenta el endpoint de health check del servidor.

## Readiness

Verifica si el servidor está listo para recibir solicitudes.

### `GET /api/healthz`

#### Descripción
Endpoint de health check que indica si el servidor está operativo y listo para procesar solicitudes. Útil para load balancers y orquestadores de contenedores.

#### Request

**Headers:**
```
Content-Type: application/json
```

#### Response

**Status Code: 200 OK**

```json
{}
```

Respuesta vacía (solo el status 200 indica que está listo).

#### Usos Típicos

- **Kubernetes**: Usado como `livenessProbe` y `readinessProbe`
- **Load Balancers**: Para verificar si el servidor está operativo
- **Monitoreo**: Para confirmar que el servidor está activo
- **Deployment**: Para verificar si el rollout fue exitoso

#### Ejemplo

```bash
curl -X GET http://localhost:8080/api/healthz
# Respuesta: 200 OK
```

#### Verificar Estado

```bash
curl -i http://localhost:8080/api/healthz
# HTTP/1.1 200 OK
# Content-Type: application/json
# Connection: keep-alive
# 
# {}
```

---

## 📋 Configuración en Kubernetes

### Liveness Probe
```yaml
livenessProbe:
  httpGet:
    path: /api/healthz
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 10
```

### Readiness Probe
```yaml
readinessProbe:
  httpGet:
    path: /api/healthz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

---

## 🔄 Configuración en Docker Compose

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/api/healthz"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

---

## 💡 Monitoreo Básico

### Script de Monitoreo Simple
```bash
#!/bin/bash

# Revisar health cada 5 segundos
while true; do
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/healthz)
  
  if [ "$response" = "200" ]; then
    echo "✅ Server is healthy - $(date)"
  else
    echo "❌ Server is unhealthy - Status: $response - $(date)"
  fi
  
  sleep 5
done
```

### Monitoreo con Alertas
```bash
#!/bin/bash

# Enviar alerta si el servidor cae
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/healthz)

if [ "$response" != "200" ]; then
  # Enviar notificación (ejemplo con webhook)
  curl -X POST https://alerts.example.com/webhook \
    -d "Server is down! Status code: $response"
fi
```

---

## 📊 Casos de Uso

### 1. Verificar si el servidor está corriendo
```bash
curl http://localhost:8080/api/healthz && echo "✅ Server is up"
```

### 2. Verificar en un script de deployment
```bash
# Esperar a que el servidor esté listo
timeout=30
while [ $timeout -gt 0 ]; do
  curl -s http://localhost:8080/api/healthz > /dev/null && break
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -eq 0 ]; then
  echo "Server didn't start in time"
  exit 1
fi
```

### 3. Monitoreo de disponibilidad
```bash
# Revisar cada minuto
* * * * * curl -f http://localhost:8080/api/healthz || (echo "DOWN" | mail -s "Server Down" admin@example.com)
```

---

## 🔐 Notas de Seguridad

### Disponibilidad Pública
- Este endpoint está disponible sin autenticación
- Está diseñado para ser accesible por load balancers y orquestadores
- No expone información sensible

### Rate Limiting
- Considera implementar rate limiting específico para este endpoint si recibe muchas solicitudes
- Los health checks típicamente no deberían ser rate-limited

### DDoS Protection
- Este endpoint puede ser un objetivo para ataques DDoS
- Considera configurar firewall rules para limitar acceso desde IPs no confiables

---

## 📝 Integración con Servicios de Monitoreo

### Uptime Robot
```
URL: http://your-domain.com/api/healthz
Método: GET
Intervalo: 5 minutos
```

### DataDog
```yaml
init_config:

instances:
  - name: Chirpy Server
    url: http://localhost:8080/api/healthz
    method: GET
    timeout: 5
```

### Prometheus
```yaml
scrape_configs:
  - job_name: 'chirpy'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/api/healthz'
```

---

## ⚡ Respuesta Rápida

Este endpoint está optimizado para responder lo más rápido posible:
- Sin lógica de base de datos
- Sin autenticación
- Respuesta mínima
- Típicamente < 10ms

---

## 📋 Resumen

| Aspecto | Detalle |
|--------|---------|
| **Método HTTP** | GET |
| **Ruta** | `/api/healthz` |
| **Autenticación** | No |
| **Status Exitoso** | 200 OK |
| **Respuesta** | JSON vacío `{}` |
| **Propósito** | Verificar disponibilidad del servidor |


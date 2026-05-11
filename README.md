# 🐦 Chirpy - API de Publicaciones Cortas

Una API moderna y rápida para gestionar usuarios y publicar mensajes cortos (chirps). Construida con **TypeScript**, **Express** y **Bun**.

## 📖 Documentación

- 🚀 [Guía de Inicio Rápido](./docs/GETTING_STARTED.md) - Comienza en 5 minutos
- 📚 [Documentación Principal](./docs/README.md) - Guía completa de la API
- 📋 [Referencia Rápida](./docs/QUICK_REFERENCE.md) - Todos los endpoints de un vistazo
- 🔐 [Autenticación](./docs/auth.md) - JWT, tokens y refresh tokens
- 👤 [Usuarios](./docs/users.md) - Crear y actualizar usuarios
- 🐦 [Chirps](./docs/chirps.md) - Operaciones con publicaciones
- ⚙️ [Admin](./docs/admin.md) - Endpoints administrativos
- 🔗 [Webhooks](./docs/webhooks.md) - Integración con Polka
- 💚 [Health Check](./docs/health.md) - Verificar estado del servidor

## 🛠️ Tecnologías

| Tecnología | Descripción |
|-----------|------------|
| **[Bun](https://bun.com)** | Runtime JavaScript/TypeScript rápido y moderno |
| **[TypeScript](https://www.typescriptlang.org/)** | Lenguaje tipado para JavaScript |
| **[Express](https://expressjs.com/)** | Framework web para Node.js/Bun |
| **[PostgreSQL](https://www.postgresql.org/)** | Base de datos relacional |
| **[Drizzle ORM](https://orm.drizzle.team/)** | ORM typesafe para TypeScript |
| **[JWT](https://jwt.io/)** | JSON Web Tokens para autenticación |
| **[Bcrypt](https://www.npmjs.com/package/bcrypt)** | Hash seguro de contraseñas |

## 📋 Requisitos

- **Bun** v1.3.13 o superior ([Instalar](https://bun.sh))
- **Node.js** 18+ (opcional, si usas npm)
- **PostgreSQL** 14+ con una base de datos configurada

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd ts-http-server
```

### 2. Instalar Dependencias

```bash
bun install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/chirpy

# JWT
JWT_SECRET=tu-clave-secreta-muy-larga-y-compleja
JWT_DURATION=3600

# Polka (opcional)
POLKA_API_KEY=tu-api-key-de-polka

# Puerto
API_PORT=8080
```

### 4. Ejecutar Migraciones de Base de Datos

```bash
bun run drizzle-kit push:pg
```

### 5. Iniciar el Servidor

```bash
bun run index.ts
```

El servidor estará disponible en `http://localhost:8080`

## ✅ Verificar que Todo Funciona

```bash
# Health check
curl http://localhost:8080/api/healthz

# Crear un usuario de prueba
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📁 Estructura del Proyecto

```
ts-http-server/
├── src/
│   ├── api/                 # Endpoints y handlers
│   │   ├── auth.ts         # Autenticación (login, refresh, revoke)
│   │   ├── users.ts        # Gestión de usuarios
│   │   ├── chirps.ts       # Operaciones con chirps
│   │   ├── webhooks.ts     # Webhooks de Polka
│   │   ├── middleware.ts   # Middlewares de Express
│   │   ├── errors.ts       # Clases de error personalizadas
│   │   └── ...
│   ├── db/
│   │   ├── schema.ts       # Definición del esquema con Drizzle
│   │   ├── queries/        # Queries pre-compiladas
│   │   └── migrations/     # Migraciones SQL
│   ├── auth.ts             # Lógica de autenticación (JWT, bcrypt)
│   ├── config.ts           # Configuración de la app
│   └── index.ts            # Punto de entrada principal
├── docs/                    # Documentación de la API
│   ├── README.md           # Documentación principal
│   ├── GETTING_STARTED.md  # Guía rápida
│   ├── QUICK_REFERENCE.md  # Referencia visual
│   └── ...
├── package.json            # Dependencias del proyecto
├── tsconfig.json           # Configuración de TypeScript
├── drizzle.config.ts       # Configuración de Drizzle ORM
└── README.md               # Este archivo
```

## 🎯 Endpoints Principales

### Autenticación
- `POST /api/users` - Crear usuario
- `POST /api/login` - Login
- `POST /api/refresh` - Refrescar token
- `POST /api/revoke` - Logout (revocar token)

### Chirps
- `POST /api/chirps` - Crear chirp
- `GET /api/chirps` - Obtener chirps
- `GET /api/chirps/:chirpId` - Obtener chirp específico
- `DELETE /api/chirps/:chirpId` - Eliminar chirp

### Usuarios
- `PUT /api/users` - Actualizar usuario

### Admin
- `GET /admin/metrics` - Ver métricas
- `POST /admin/reset` - Reiniciar métricas

Para la documentación completa de cada endpoint, consulta [docs/QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)

## 🧪 Desarrollo

### Ejecutar en Modo Watch

```bash
bun run --watch index.ts
```

### Ver Logs de Base de Datos

```bash
# Ver queries SQL
DEBUG=drizzle:* bun run index.ts
```

### Ejecutar Tests

```bash
bun test
```

## 🔐 Características de Seguridad

- ✅ **JWT Authentication** - Tokens seguros con expiración
- ✅ **Refresh Tokens** - Renovación segura de acceso
- ✅ **Bcrypt Hashing** - Contraseñas hasheadas con salt
- ✅ **API Key Validation** - Para webhooks
- ✅ **CORS Ready** - Configurado para CORS
- ✅ **Error Handling** - Manejo consistente de errores

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|------------|---------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgres://user:pass@localhost:5432/chirpy` |
| `JWT_SECRET` | Clave secreta para JWT | Mínimo 32 caracteres aleatorios |
| `JWT_DURATION` | Duración del token en segundos | `3600` (1 hora) |
| `POLKA_API_KEY` | API Key para webhooks de Polka | Token único y seguro |
| `API_PORT` | Puerto donde corre el servidor | `8080` |

## 🚀 Deployment

### Con Docker

```dockerfile
FROM oven/bun:latest

WORKDIR /app
COPY . .

RUN bun install
EXPOSE 8080

CMD ["bun", "run", "index.ts"]
```

### Con Render, Railway o Heroku

1. Conecta tu repositorio
2. Configura las variables de entorno
3. Deploy automático en cada push

## 🐛 Solución de Problemas

### Error de conexión a BD
```
Error: ECONNREFUSED - PostgreSQL no está corriendo
```
**Solución:** Inicia PostgreSQL: `brew services start postgresql` (en macOS)

### Error de migraciones
```
Error: Failed to run migrations
```
**Solución:** 
```bash
bun run drizzle-kit generate:pg
bun run drizzle-kit push:pg
```

### Puerto 8080 en uso
```
Error: EADDRINUSE: address already in use :::8080
```
**Solución:** Cambia el puerto en `.env` o mata el proceso: `lsof -ti:8080 | xargs kill -9`

## 📊 Ejemplos de Uso

### Flujo Completo: Registro → Login → Publicar

```bash
# 1. Crear usuario
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# 2. Login y obtener token
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# 3. Publicar un chirp (usa el token del paso 2)
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_AQUI>" \
  -d '{
    "body": "¡Mi primer chirp!"
  }'

# 4. Ver todos los chirps
curl http://localhost:8080/api/chirps
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto y Soporte

- 📧 Email: soporte@chirpy.dev
- 🐛 Issues: [GitHub Issues](../../issues)
- 💬 Discussions: [GitHub Discussions](../../discussions)

---

**Built with ❤️ using Bun, TypeScript y Express**

*Última actualización: Mayo 2026*

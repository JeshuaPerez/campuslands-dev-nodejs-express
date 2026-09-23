# Ejercicio 30 avanzado - proyecto final avanzado (Jeshua Perez)

Taller de motos, version avanzada: cierra los 90 ejercicios integrando lo
visto en el nivel avanzado sobre la base de básico/intermedio.

## Que integra

- **app/server separados**: `app.js` no llama `listen`, solo lo hace `server.js`.
- **Validacion con schemas**: `crearOrdenSchema` (zod) via middleware `validarSchema`.
- **Errores de dominio**: `OrdenNoEncontradaError` / `OrdenYaCerradaError`, cada
  una con su `statusCode`, manejadas por un `errorHandler` central sin switch.
- **Multirol**: `requireAlgunRol("mecanico", "admin")` — cerrar exige `admin`.
- **Paginacion y filtros**: `GET /ordenes` con `?page=`, `?limit=`, `?estado=`.
- **Health check**: `GET /health` sin autenticacion.

## Endpoints

- `GET /ordenes` — requiere rol mecanico o admin.
- `POST /ordenes` — requiere rol mecanico o admin; `{ "moto", "falla" }` validado con zod.
- `PATCH /ordenes/:id/cerrar` — requiere rol admin. `404` si no existe, `409` si ya estaba cerrada.
- `GET /health` — publico.

Tokens de prueba: `token-mecanico`, `token-admin`.

## Como ejecutar

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

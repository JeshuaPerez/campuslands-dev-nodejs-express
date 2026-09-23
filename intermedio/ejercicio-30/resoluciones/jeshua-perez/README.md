# Ejercicio 30 intermedio - proyecto integrador intermedio (Jeshua Perez)

Taller de motos, version intermedia: integra capas, auth con roles,
paginacion, manejo de errores centralizado y tests de servicio + de rutas.

## Endpoints

- `GET /ordenes` — requiere estar autenticado. Pagina con `?page=`/`?limit=`
  y filtra con `?estado=`.
- `POST /ordenes` — requiere rol `mecanico`. `{ "moto": "...", "falla": "..." }`.
- `PATCH /ordenes/:id/cerrar` — requiere rol `admin`. `409` si ya estaba cerrada.

Tokens de prueba: `token-mecanico`, `token-admin` (`Authorization: Bearer <token>`).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3050/ordenes -H "Authorization: Bearer token-admin"
```

## Tests

```bash
npm test
```

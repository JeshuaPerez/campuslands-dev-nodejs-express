# Ejercicio 16 intermedio - rutas protegidas (Jeshua Perez)

## Que hace

Tematica ropa y sneakers. `GET /sneakers` requiere estar autenticado
(`requireAuth`); `POST /sneakers` ademas requiere el rol `admin`
(`requireRol("admin")`). `401` sin token, `403` sin el rol correcto.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3036/sneakers -H "Authorization: Bearer token-cliente"
curl -X POST http://localhost:3036/sneakers \
  -H "Content-Type: application/json" -H "Authorization: Bearer token-admin" \
  -d '{"modelo":"Superstar"}'
```

## Tests

```bash
npm test
```

# Ejercicio 14 intermedio - autenticacion simulada (Jeshua Perez)

## Que hace

Tematica libros. `requireAuth` exige un header `Authorization: Bearer <token>`
con un token fijo (simulado, sin JWT ni base de datos) para poder crear
libros. `401` si falta el header, `403` si el token es invalido.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3034/libros \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token-biblioteca-123" \
  -d '{"titulo":"1984"}'
```

## Tests

```bash
npm test
```

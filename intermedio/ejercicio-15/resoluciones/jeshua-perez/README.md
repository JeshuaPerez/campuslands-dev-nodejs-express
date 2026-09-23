# Ejercicio 15 intermedio - JWT basico (Jeshua Perez)

## Que hace

Tematica comida urbana. `POST /auth/login` valida un usuario demo y firma un
JWT real con `jsonwebtoken`. `GET /pedidos` esta protegido por `requireJwt`,
que verifica el token del header `Authorization: Bearer <token>`.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3035/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"foodie","clave":"tacos123"}'
```

## Tests

```bash
npm test
```

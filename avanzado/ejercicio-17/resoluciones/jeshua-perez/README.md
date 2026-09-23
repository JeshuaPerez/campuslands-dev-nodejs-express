# Ejercicio 17 avanzado - refresh tokens conceptual (Jeshua Perez)

## Que hace

Tematica viajes y turismo. `POST /auth/login` emite un `accessToken` (JWT,
5 min) y un `refreshToken` (UUID, guardado en una lista de activos).
`POST /auth/refresh` cambia un refresh token valido por un access token
nuevo. `POST /auth/logout` revoca el refresh token (lo saca de la lista).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3067/auth/login
```

## Tests

```bash
npm test
```

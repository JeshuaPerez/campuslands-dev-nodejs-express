# Ejercicio 01 intermedio - arquitectura por capas (Jeshua Perez)

## Que hace

Tematica videojuegos RPG. `GET /misiones` (con filtro `?estado=`),
`POST /misiones` y `PATCH /misiones/:id/completar`, separado en tres capas:
`routes` (declara rutas), `controllers` (traduce a HTTP) y `services` (logica
pura de negocio, sin nada de Express).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3021/misiones \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Cazar dragon","recompensaOro":500}'
```

## Tests

```bash
npm test
```

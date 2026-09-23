# Ejercicio 18 - rutas POST (Jeshua Perez)

## Que hace

Tematica paracaidismo. `src/routes/saltos.routes.js` expone `GET /saltos` y
`POST /saltos`, que valida `paracaidista` y `altitudMetros` antes de crear el
registro (guardado en memoria).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3008/saltos \
  -H "Content-Type: application/json" \
  -d '{"paracaidista":"Ana","altitudMetros":4000}'
```

## Tests

```bash
npm test
```

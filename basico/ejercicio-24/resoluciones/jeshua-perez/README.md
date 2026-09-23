# Ejercicio 24 - CRUD basico (Jeshua Perez)

## Que hace

Tematica formulas quimicas. CRUD completo sobre un arreglo en memoria:
`GET /formulas`, `GET /formulas/:id`, `POST /formulas`, `PUT /formulas/:id`,
`DELETE /formulas/:id`.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3014/formulas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Sal","simbolo":"NaCl"}'
```

## Tests

```bash
npm test
```

# Ejercicio 23 - datos en memoria (Jeshua Perez)

## Que hace

Tematica soldadura. Un arreglo en memoria guarda los trabajos de soldadura.
`GET /trabajos`, `POST /trabajos` y `DELETE /trabajos/:id` (404 si no existe).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3013/trabajos \
  -H "Content-Type: application/json" \
  -d '{"pieza":"Viga","tipoSoldadura":"MIG"}'
```

## Tests

```bash
npm test
```

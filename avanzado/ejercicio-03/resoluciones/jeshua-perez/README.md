# Ejercicio 03 avanzado - validacion con schemas (Jeshua Perez)

## Que hace

Tematica MOBA esports. `heroeSchema` (zod) define la forma de un heroe:
`nombre` obligatorio, `rol` limitado a un enum, `nivel` opcional (default 1,
entre 1 y 30). `validarSchema(schema)` es un middleware generico que valida
`req.body` contra cualquier schema de zod.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3053/heroes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Axe","rol":"tanque"}'
```

## Tests

```bash
npm test
```

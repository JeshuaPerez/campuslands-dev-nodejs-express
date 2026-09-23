# Ejercicio 03 intermedio - controladores limpios (Jeshua Perez)

## Que hace

Tematica MOBA esports. Los controladores de `src/controllers/heroes.controller.js`
son delgados: usan `asyncHandler` para no repetir try/catch por el error
inesperado, y solo traducen el resultado o el error esperado del servicio a
una respuesta HTTP.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3023/heroes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Axe","rol":"tanque"}'
```

## Tests

```bash
npm test
```

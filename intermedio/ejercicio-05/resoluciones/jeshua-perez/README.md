# Ejercicio 05 intermedio - repositorios en memoria (Jeshua Perez)

## Que hace

Tematica futbol y futbol sala. `src/repositorios/equipos.repositorio.js` solo
guarda y consulta datos (sin reglas de negocio); `src/services/equipos.service.js`
valida y usa el repositorio; el controlador traduce a HTTP.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3025/equipos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"River Plate","liga":"Argentina"}'
```

## Tests

```bash
npm test
```

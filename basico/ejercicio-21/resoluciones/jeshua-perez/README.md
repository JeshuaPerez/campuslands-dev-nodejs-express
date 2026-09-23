# Ejercicio 21 - estructura src routes controllers (Jeshua Perez)

## Que hace

Tematica animacion 3D. Separacion en capas: `src/routes/modelos.routes.js`
solo declara las rutas, `src/controllers/modelos.controller.js` tiene la
logica de `GET /modelos` y `POST /modelos`.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3011/modelos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Dragon","software":"Blender"}'
```

## Tests

```bash
npm test
```

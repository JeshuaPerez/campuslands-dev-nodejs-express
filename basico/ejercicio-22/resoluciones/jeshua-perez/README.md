# Ejercicio 22 - servicios simples (Jeshua Perez)

## Que hace

Tematica arquitectura 3D. `src/services/proyectos.service.js` tiene la
logica pura (`estimarCosto`), el controlador solo llama al servicio y
traduce el resultado o el error a una respuesta HTTP.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3012/proyectos/estimaciones \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Casa moderna","metrosCuadrados":100}'
```

## Tests

```bash
npm test
```

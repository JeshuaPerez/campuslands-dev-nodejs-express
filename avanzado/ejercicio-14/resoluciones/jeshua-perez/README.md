# Ejercicio 14 avanzado - metricas simples (Jeshua Perez)

## Que hace

Tematica libros. `metricas` cuenta peticiones por `metodo + ruta + status`
en memoria. `registrarMetricas` (middleware) alimenta el contador en cada
peticion; `GET /metrics` expone el resumen.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3064/libros
curl http://localhost:3064/metrics
```

## Tests

```bash
npm test
```

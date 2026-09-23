# Ejercicio 06 avanzado - colas de tareas conceptuales (Jeshua Perez)

## Que hace

Tematica motos y mecanica. `ColaTareas` procesa reparaciones en orden, de a
una, sin bloquear el hilo principal. Es conceptual (en memoria, sin Redis
ni un broker real). `POST /reparaciones` encola; `GET /reparaciones/estado`
muestra pendientes y completadas.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3056/reparaciones -H "Content-Type: application/json" -d '{"moto":"Yamaha"}'
curl http://localhost:3056/reparaciones/estado
```

## Tests

```bash
npm test
```

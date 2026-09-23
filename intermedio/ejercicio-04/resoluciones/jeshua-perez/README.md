# Ejercicio 04 intermedio - servicios reutilizables (Jeshua Perez)

## Que hace

Tematica battle royale. `crearColeccionService(nombreRecurso)` fabrica un
servicio CRUD en memoria; se reutiliza para `jugadores` y `zonas` sin
duplicar codigo, cada uno con su propio estado aislado.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3024/jugadores -H "Content-Type: application/json" -d '{"nombre":"Ninja"}'
curl -X POST http://localhost:3024/zonas -H "Content-Type: application/json" -d '{"nombre":"Zona segura"}'
```

## Tests

```bash
npm test
```

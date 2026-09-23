# Ejercicio 19 avanzado - auditoria de acciones (Jeshua Perez)

## Que hace

Tematica tatuajes. `auditar(accion)` es un middleware que, solo si la
respuesta termina en 2xx, registra quien hizo que accion y sobre que
recurso (usuario tomado del header `X-Usuario` para esta demo).
`GET /auditoria` lista todo lo registrado.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3069/disenos \
  -H "Content-Type: application/json" -H "X-Usuario: Ana" \
  -d '{"nombre":"Golondrina"}'
curl http://localhost:3069/auditoria
```

## Tests

```bash
npm test
```

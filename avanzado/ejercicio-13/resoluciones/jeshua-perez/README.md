# Ejercicio 13 avanzado - observabilidad y logs (Jeshua Perez)

## Que hace

Tematica ciencia ficcion. `logger` (lib/logger.js) imprime cada evento
como una linea JSON (nivel, mensaje, timestamp, metadatos), en vez de texto
libre. `logRequests` loguea cada peticion HTTP con metodo, ruta, status y
duracion. `GET /health` expone el uptime del proceso.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3063/health
```

## Tests

```bash
npm test
```

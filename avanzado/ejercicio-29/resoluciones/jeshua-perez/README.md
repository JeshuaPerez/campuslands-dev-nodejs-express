# Ejercicio 29 avanzado - deploy readiness (Jeshua Perez)

## Que hace

Tematica futbol y futbol sala. `GET /health` (liveness) siempre responde
200 si el proceso esta vivo. `GET /ready` (readiness) responde 503 hasta
que `inicializarDependencias()` termina, y vuelve a 503 si el proceso
recibe `SIGTERM` (apagado ordenado: deja de aceptar trafico antes de
cerrar el servidor de verdad).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3079/health
curl http://localhost:3079/ready
```

## Tests

```bash
npm test
```

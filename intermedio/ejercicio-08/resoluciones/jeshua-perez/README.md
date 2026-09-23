# Ejercicio 08 intermedio - middleware de request id (Jeshua Perez)

## Que hace

Tematica hiperdeportivos. `requestId` genera un `crypto.randomUUID()` por
peticion, lo guarda en `req.id` y lo expone en el header `X-Request-Id` de la
respuesta (util para rastrear una peticion en los logs).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -i http://localhost:3028/hiperdeportivos
```

## Tests

```bash
npm test
```

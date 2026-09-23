# Ejercicio 27 intermedio - documentacion de endpoints (Jeshua Perez)

API de torneos MOBA esports.

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

## Endpoints

### `GET /torneos`

Lista los torneos.

### `POST /torneos`

Crea un torneo. Body: `{ "nombre": "string", "juego": "string" }`.
`201` si se crea, `400` si faltan datos.

### `GET /docs`

Devuelve la documentacion de la API en JSON (util para probarla desde
Postman o Thunder Client sin leer el codigo fuente):

```bash
curl http://localhost:3047/docs
```

## Tests

```bash
npm test
```

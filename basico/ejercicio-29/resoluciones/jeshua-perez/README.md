# Ejercicio 29 - README tecnico (Jeshua Perez)

API de goleadores de futbol y futbol sala.

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

El servidor queda escuchando en `http://localhost:3019` (configurable con la
variable de entorno `PORT`).

## Endpoints

### `GET /goleadores`

Lista los goleadores. Acepta el filtro opcional `?modalidad=futbol` o
`?modalidad=futbol sala`.

```bash
curl http://localhost:3019/goleadores
curl "http://localhost:3019/goleadores?modalidad=futbol"
```

Respuesta `200`:

```json
{ "ok": true, "data": [{ "id": 1, "nombre": "Marta", "goles": 18, "modalidad": "futbol" }] }
```

### `PATCH /goleadores/:id/gol`

Suma un gol al goleador indicado.

```bash
curl -X PATCH http://localhost:3019/goleadores/1/gol
```

Respuesta `200` si existe, `404` si el id no corresponde a ningun goleador:

```json
{ "ok": false, "message": "Goleador no encontrado" }
```

## Tests

```bash
npm test
```

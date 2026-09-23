# Ejercicio 17 - rutas GET (Jeshua Perez)

## Que hace

Tematica viajes y turismo. `src/routes/destinos.routes.js` expone
`GET /destinos` (lista, con filtro opcional `?pais=`) y `GET /destinos/:id`
(uno solo, 404 si no existe).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3007/destinos
curl "http://localhost:3007/destinos?pais=Peru"
curl http://localhost:3007/destinos/1
```

## Tests

```bash
npm test
```

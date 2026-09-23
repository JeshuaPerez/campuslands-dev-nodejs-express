# Ejercicio 19 - req.params y req.query (Jeshua Perez)

## Que hace

Tematica tatuajes. `GET /estudios/:estudioId/disenos` combina `req.params`
(el estudio) con `req.query` (`?estilo=` opcional) para filtrar los disenos
de un estudio de tatuajes.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3009/estudios/1/disenos
curl "http://localhost:3009/estudios/1/disenos?estilo=realismo"
```

## Tests

```bash
npm test
```

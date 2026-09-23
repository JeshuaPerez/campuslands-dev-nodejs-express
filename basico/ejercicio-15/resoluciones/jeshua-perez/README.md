# Ejercicio 15 - mini API HTTP nativa (Jeshua Perez)

## Que hace

Tematica comida urbana. `src/server.js` crea un servidor con el modulo nativo
`node:http` (sin Express) que responde `GET /platillos` con una lista de
comida callejera, y `404` para cualquier otra ruta.

## Como ejecutar

```bash
npm install
npm start
```

```bash
curl http://localhost:3005/platillos
```

## Tests

Usan `servidor.listen(0)` (puerto efimero) y `fetch` nativo:

```bash
npm test
```

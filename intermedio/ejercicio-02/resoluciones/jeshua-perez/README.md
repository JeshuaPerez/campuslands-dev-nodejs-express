# Ejercicio 02 intermedio - routers modulares (Jeshua Perez)

## Que hace

Tematica shooters competitivos. `armas.routes.js` y `jugadores.routes.js` son
routers independientes; `routes/index.js` los monta bajo `/armas` y
`/jugadores` para que `app.js` solo importe un unico router.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3022/armas
curl http://localhost:3022/jugadores
```

## Tests

```bash
npm test
```

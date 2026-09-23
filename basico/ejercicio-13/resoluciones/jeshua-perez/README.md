# Ejercicio 13 - manejo de errores (Jeshua Perez)

## Que hace

Tematica ciencia ficcion. `src/services/warp.service.js` define una clase de
error propia `WarpError` y `calcularViajeWarp(distanciaAnios, factorWarp)`, que
la lanza si el factor warp no es un numero valido o esta fuera de rango (1-9).

`src/app.js` distingue con `instanceof WarpError` entre un error de navegacion
esperado y cualquier otro error inesperado.

## Como ejecutar

```bash
npm install
npm start
```

Opcional, pasar distancia y factor:

```bash
node src/app.js 4 9
```

## Como probar el caso de error

```bash
node src/app.js 4 15
```

## Tests

```bash
npm test
```

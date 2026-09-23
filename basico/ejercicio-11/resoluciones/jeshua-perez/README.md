# Ejercicio 11 - promesas basicas (Jeshua Perez)

## Que hace

Tematica musica. `src/services/track.service.js` expone `playTrack(trackName)`,
una funcion que devuelve una `Promise`: usa `setTimeout` para simular el tiempo
de carga de una cancion y rechaza si no llega un nombre valido.

`src/app.js` encadena `.then`/`.catch` sobre la promesa e imprime una linea
justo despues de invocarla, para demostrar que el codigo sigue antes de que
la promesa se resuelva.

## Como ejecutar

```bash
npm install
npm start
```

Opcional, pasar nombre de cancion:

```bash
node src/app.js "Imagine"
```

## Como probar el caso de error

```bash
node src/app.js ""
```

## Tests

```bash
npm test
```

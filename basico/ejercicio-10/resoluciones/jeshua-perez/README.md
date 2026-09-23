# Ejercicio 10 - funciones asincronas (Jeshua Perez)

## Que hace

Tematica pingpong. `src/services/rally.service.js` expone `playRally(playerName)`,
una funcion asincrona que devuelve una `Promise`: usa `setTimeout` para simular
el tiempo que tarda en resolverse un punto sin bloquear el hilo principal, y
rechaza la promesa si no llega un nombre de jugador valido.

`src/app.js` llama a `playRally` con `await` dentro de una funcion `main`, pero
imprime una linea justo despues de invocarla (fuera del `await`) para demostrar
que el codigo sigue ejecutandose antes de que el rally termine.

## Como ejecutar

```bash
npm install
npm start
```

Opcional, pasar nombre de jugador:

```bash
node src/app.js Marco
```

## Como probar el caso de error

```bash
node src/app.js ""
```

Debe imprimir `Error en el rally: El nombre del jugador es obligatorio`.

## Tests

```bash
npm test
```

## Estructura

```text
src/
├── app.js
└── services/
    └── rally.service.js
tests/
└── rally.service.test.js
```

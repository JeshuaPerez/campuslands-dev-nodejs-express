# Ejercicio 29 intermedio - refactor de API (Jeshua Perez)

## Que hace

Tematica futbol y futbol sala. API de partidos (crear, listar, registrar
gol) separada en capas.

## Que se refactorizo

La version inicial (comun en los primeros ejercicios) tenia todo junto en
`app.js`: la ruta parseaba `req.body`, validaba a mano y mutaba el arreglo
de partidos ahi mismo. Se separo en:

- `services/partidos.service.js`: logica pura (validaciones, mutacion del
  estado), sin nada de Express, facil de testear con datos directos.
- `controllers/partidos.controller.js`: traduce el resultado o el error del
  servicio a codigo HTTP (400/404/200/201).
- `routes/partidos.routes.js`: solo declara las rutas.

Beneficio: los tests de `partidos.service.test.js` llaman las funciones
directo, sin levantar servidor ni depender de Express.

## Como ejecutar

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

# Ejercicio 12 - async await (Jeshua Perez)

## Que hace

Tematica peliculas de miedo. `src/services/movie.service.js` expone
`loadMovie(movieName)` (Promise con setTimeout) y `loadMarathon(a, b)`, una
funcion `async` que usa `await` para cargar dos peliculas **en secuencia**.

`src/app.js` llama a `loadMarathon` dentro de un `try/catch` async.

## Como ejecutar

```bash
npm install
npm start
```

Opcional, pasar nombres de peliculas:

```bash
node src/app.js "It" "Annabelle"
```

## Como probar el caso de error

```bash
node src/app.js ""
```

## Tests

```bash
npm test
```

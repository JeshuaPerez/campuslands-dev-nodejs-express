# Ejercicio 14 - validacion de entrada (Jeshua Perez)

## Que hace

Tematica libros. `src/services/book.service.js` expone `validateBook(datos)`,
que devuelve la lista de errores encontrados (titulo, autor y paginas), y
`createBook(datos)`, que lanza si hay errores o devuelve el libro normalizado.

## Como ejecutar

```bash
npm install
npm start -- "Dune" "Frank Herbert" 412
```

## Como probar el caso de error

```bash
node src/app.js "" "" -1
```

## Tests

```bash
npm test
```

# Ejercicio 12 avanzado - exportacion JSON (Jeshua Perez)

## Que hace

Tematica peliculas de miedo. `GET /peliculas/exportar` arma el header
`Content-Disposition: attachment` para que el navegador o curl lo trate
como una descarga de archivo, no como una respuesta JSON comun.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -OJ http://localhost:3062/peliculas/exportar
```

## Tests

```bash
npm test
```

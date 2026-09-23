# Ejercicio 10 avanzado - lectura de CSV (Jeshua Perez)

## Que hace

Tematica pingpong. `datos/resultados.csv` guarda resultados de partidas;
`csv.service.js` lo lee con `fs/promises` y lo parsea a JSON (encabezado +
filas, sin dependencias externas). `GET /resultados` lo expone.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3060/resultados
```

## Tests

```bash
npm test
```

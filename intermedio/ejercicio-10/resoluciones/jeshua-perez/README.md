# Ejercicio 10 intermedio - ordenamiento de resultados (Jeshua Perez)

## Que hace

Tematica pingpong. `GET /jugadores` acepta `?sort=nombre|puntaje` y
`?order=asc|desc`. Si `sort` no es un campo permitido, responde `400`.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl "http://localhost:3030/jugadores?sort=puntaje&order=desc"
```

## Tests

```bash
npm test
```

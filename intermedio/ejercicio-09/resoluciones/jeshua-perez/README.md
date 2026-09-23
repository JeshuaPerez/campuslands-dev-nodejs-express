# Ejercicio 09 intermedio - paginacion y filtros (Jeshua Perez)

## Que hace

Tematica kickboxing. `GET /peleadores` acepta `?page=`, `?limit=` (maximo 50)
y `?categoria=` (pesado/semipesado). El filtro se aplica antes de paginar.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl "http://localhost:3029/peleadores?page=2&limit=5"
curl "http://localhost:3029/peleadores?categoria=pesado"
```

## Tests

```bash
npm test
```
